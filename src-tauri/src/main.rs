// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use db::init_db;
use rusqlite::params;
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{command, generate_context, generate_handler, Manager, State};
use uuid::Uuid;
use chrono::NaiveDateTime;

mod db;

#[derive(serde::Serialize, serde::Deserialize)]
struct Note {
    id: String,
    content: String,
    parent_id: Option<String>,
    is_dir: bool,
    created_at: NaiveDateTime,
    updated_at: NaiveDateTime
}

#[derive(serde::Serialize, serde::Deserialize)]
struct NewNote {
    id: String,
    content: String,
    parent_id: Option<String>,
    is_dir: bool,
}

struct AppState {
    db_path: Mutex<PathBuf>,
}

#[command]
fn get_notes(state: State<'_, AppState>) -> Result<Vec<Note>, String> {
    let db_path = state.db_path.lock().unwrap();
    let conn = init_db(db_path.clone()).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, content, parent_id, is_dir, created_at, updated_at FROM notes")
        .map_err(|e| e.to_string())?;
    let note_iter = stmt
        .query_map([], |row| {
            Ok(Note {
                id: row.get(0)?,
                content: row.get(1)?,
                parent_id: row.get(2)?,
                is_dir: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?
            })
        })
        .map_err(|e| e.to_string())?;

    let mut notes: Vec<Note> = note_iter.filter_map(Result::ok).collect();
    notes.reverse();
    Ok(notes)
}

#[command]
fn add_note(state: State<'_, AppState>, content: String) -> Result<NewNote, String> {
    let db_path = state.db_path.lock().unwrap();
    let conn = init_db(db_path.clone()).map_err(|e| e.to_string())?;
    let new_note = NewNote {
        id: Uuid::new_v4().to_string(),
        content,
        parent_id: Option::None,
        is_dir: false,
    };

    conn.execute(
        "INSERT INTO notes (id, content, parent_id, is_dir) VALUES (?1, ?2, ?3, ?4)",
        params![
            new_note.id,
            new_note.content,
            new_note.parent_id,
            new_note.is_dir
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(new_note)
}

#[command]
fn get_note_by_id(state: State<'_, AppState>, id: String) -> Result<Note, String> {
    let db_path = state.db_path.lock().unwrap();
    let conn = init_db(db_path.clone()).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, content, parent_id, is_dir, created_at, updated_at FROM notes WHERE id = ?1")
        .map_err(|e| e.to_string())?;
    let note = stmt
        .query_row(params![id], |row| {
            Ok(Note {
                id: row.get(0)?,
                content: row.get(1)?,
                parent_id: row.get(2)?,
                is_dir: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(note)
}

#[command]
fn update_note(state: State<'_, AppState>, id: String, content: String) -> Result<NewNote, String> {
    let db_path = state.db_path.lock().unwrap();
    let conn = init_db(db_path.clone()).map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE notes SET content = ?1 WHERE id = ?2",
        params![content, id],
    )
    .map_err(|e| e.to_string())?;

    Ok(NewNote {
        id,
        content,
        parent_id: Option::None,
        is_dir: false,
    })
}

#[command]
fn delete_note(state: State<'_, AppState>, id: String) -> Result<bool, String> {
    let db_path = state.db_path.lock().unwrap();
    let conn = init_db(db_path.clone()).map_err(|e| e.to_string())?;
    let rows_affected = conn
        .execute("DELETE FROM notes WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(rows_affected > 0)
}

#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle();
            let app_data_dir = app_handle
                .path_resolver()
                .app_data_dir()
                .expect("Failed to get app data directory");
            if !app_data_dir.exists() {
                fs::create_dir_all(&app_data_dir).expect("Failed to create app data directory");
            }
            let db_path = app_data_dir.join("notes.db");
            init_db(db_path.clone()).expect("Failed to initialize database");

            app.manage(AppState {
                db_path: Mutex::new(db_path),
            });

            Ok(())
        })
        .invoke_handler(generate_handler![
            get_notes,
            add_note,
            get_note_by_id,
            update_note,
            delete_note,
            greet
        ])
        .run(generate_context!())
        .expect("error while running tauri application");
}

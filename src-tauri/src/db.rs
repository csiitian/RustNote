use rusqlite::{Connection, Result};
use std::path::PathBuf;

pub fn init_db(db_path: PathBuf) -> Result<Connection> {
    let conn = Connection::open(db_path)?;

    // conn.execute("DROP TABLE notes", [])?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY,
          content TEXT NOT NULL,
          parent_id TEXT,
          is_dir BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )",
        [],
    )?;

    conn.execute(
        "CREATE TRIGGER IF NOT EXISTS set_updated_at
        AFTER UPDATE ON notes
        FOR EACH ROW
        BEGIN
          UPDATE notes SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
        END;
        ",
        [],
    )?;

    Ok(conn)
}

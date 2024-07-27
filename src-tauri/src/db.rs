use rusqlite::{Connection, Result};
use std::path::PathBuf;

pub fn init_db(db_path: PathBuf) -> Result<Connection> {
  let conn = Connection::open(db_path)?;

  // conn.execute("DROP TABLE notes", [])?;

  conn.execute(
      "CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY,
          content TEXT NOT NULL
      )",
      [],
  )?;

  Ok(conn)
}

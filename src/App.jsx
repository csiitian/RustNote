import { useState, useEffect } from "react";
import "./App.css";
import { invoke } from '@tauri-apps/api/tauri';
import NoteList from "./components/NoteList";
import NoteItem from "./components/NoteItem";
import NoteRightHeader from "./components/NoteRightHeader";
import NoteLeftHeader from "./components/NoteLeftHeader";

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [previewMode, setPreviewMode] = useState(true);

  useEffect(() => {
    fetchNotes(true);
  }, []);

  const fetchNotes = async (updateSelectedNote) => {
    const result = await invoke('get_notes');
    setNotes(result);
    if (updateSelectedNote && result.length > 0) {
      setSelectedNote(result[0]);
    }
  };

  const handleNoteSelect = async (id) => {
    const note = await invoke('get_note_by_id', { id });
    setSelectedNote(note);
  };

  const handleAddNote = async () => {
    const content = '';
    await invoke('add_note', { content });
    setPreviewMode(false);
    fetchNotes(true);
  };

  const handleUpdateNote = async (note) => {
    await invoke('update_note', {
      id: note.id,
      content: note.content
    });
    fetchNotes(false);
  }

  const handleDeleteNote = async () => {
    if (selectedNote === null) return;
    await invoke('delete_note', { id: selectedNote.id });
    fetchNotes(true);
  }

  return (
    <div className="container">
      <div className="flex-container">
        <div className="sidebar">
            <div className="left-header">
              <NoteLeftHeader handleAddNote={handleAddNote} handleDeleteNote={handleDeleteNote} />
            </div>
            <div className="note-list">
              <NoteList notes={notes} handleNoteSelect={handleNoteSelect} selectedNoteId={selectedNote === null ? "-1" : selectedNote.id} />
            </div>
        </div>
        <div className="content">
          {selectedNote ? (
            <NoteItem note={selectedNote} handleUpdateNote={handleUpdateNote} previewMode={previewMode} setPreviewMode={setPreviewMode} />
          ) : (
            <p>Select a note to view its content</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import ReactMarkdown from 'react-markdown';

function NoteItem({ note, handleUpdateNote, previewMode, setPreviewMode }) {
  const [markdown, setMarkdown] = useState(note.content || '');

  useEffect(() => {
    if (note.content !== markdown) {
      setMarkdown(note.content || '');
    }
  }, [note]);

  return (
    <div>
      <div class='note-editor-container'>
        <p class={previewMode ? 'note-editor-selected' : 'note-editor'} onClick={() => setPreviewMode(true)}>Preview</p>
        <p class={previewMode ? 'note-editor' : 'note-editor-selected'} onClick={() => setPreviewMode(false)}>Editor</p>
        </div>
      {previewMode ?
        <div className="markdown-preview">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
        :
        <div className="markdown-editor">
        <SimpleMDE value={markdown} onChange={(md) => {
          setMarkdown(md);
          note.content = md;
          handleUpdateNote(note);
        }} />
        </div>
      }
    </div>
  );
}

export default NoteItem;
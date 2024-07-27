import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './Toolbar';

function NoteItem({ note, handleUpdateNote }) {
  const extensions = [StarterKit]

  useEffect(() => {
      editor.commands.setContent(note.content);
      editor.commands.focus('end');
  }, [note]);

  const editor = useEditor({
    extensions,
    content: note.content,
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      note.content = updatedContent;
      handleUpdateNote(note);
    },
  });

  return (
    <div class="editor-container">
      <Toolbar editor={editor} />
      <EditorContent class="editor-content" editor={editor} />
      <FloatingMenu editor={editor}></FloatingMenu>
      <BubbleMenu editor={editor}></BubbleMenu>
    </div>
  )
}

export default NoteItem;
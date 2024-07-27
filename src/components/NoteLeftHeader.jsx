function NoteLeftHeader({ handleAddNote, handleDeleteNote }) {
  
  return (
    <div>
      <button style={{
        margin: '5px'
      }} onClick={() => handleAddNote()}>Add Note</button>
      <button onClick={() => handleDeleteNote()}>Delete Note</button>
    </div>
  );
}

export default NoteLeftHeader;
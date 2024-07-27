function NoteLeftHeader({ handleAddDir, handleAddNote, handleDeleteNote }) {
  
  return (
    <div>
      <button style={{
        marginRight: '5px',
        display: 'none',
        backgroundColor: 'darkslategray'
      }} onClick={() => handleAddDir()}>Add Directory</button>
      <button style={{
        marginRight: '5px',
        backgroundColor: 'darkslategray'
      }} onClick={() => handleAddNote()}>Add Note</button>
      <button style={{
        backgroundColor: 'darkslategray'
      }} onClick={() => handleDeleteNote()}>Delete Note</button>
    </div>
  );
}

export default NoteLeftHeader;
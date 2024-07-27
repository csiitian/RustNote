import NoteItem from "./NoteItem";

function NoteList({ notes, handleNoteSelect, selectedNoteId }) {

  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  const splitContent = (content) => {
    const parts = content.split(/\n|\./);
    const titleLen = parts.length > 0 ? parts[0].length + 1 : content.length;
    const title = content.slice(0, titleLen)
    const remainingContent = content.slice(titleLen).trim();
    return { title, content: remainingContent };
  }

  return (
    <div class="note-list-2">
      {notes.map((item, index) => {
        const { title, content } = splitContent(item.content);
        return (
          <div class={selectedNoteId === item.id ? 'selected-note' : ''}>
            <div class={selectedNoteId !== item.id && index < notes.length - 1 ? 'note-border' : 'note'} onClick={() => handleNoteSelect(item.id)} onContextMenu={handleContextMenu}>
              {title ? (<h4 style={{
                margin: '0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>{title}</h4>) :
                <h4 style={{
                  color: 'gray',
                  margin: '0'
                }}>Untitled</h4>}
              <p style={{
                margin: '0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>{content}</p>
            </div>
          </div>);
      })}
    </div>
  );
}

export default NoteList;
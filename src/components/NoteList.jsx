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

  const getTime = (utcTimeString) => {
    const utcDate = new Date(utcTimeString);

    // IST is UTC+5:30
    const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds

    // Convert UTC to IST
    const istDate = new Date(utcDate.getTime() + IST_OFFSET);

    let hours = istDate.getHours();
    const minutes = istDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hoursStr = hours < 10 ? `0${hours}` : hours;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

    return `${hoursStr}:${minutesStr} ${ampm}`;
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
              <span style={{
                color: 'gray',
                fontSize: '12px'
              }}>Last Updated at {getTime(item.updated_at)}
              </span>
            </div>
          </div>);
      })}
    </div>
  );
}

export default NoteList;
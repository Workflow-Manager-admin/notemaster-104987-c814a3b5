import React from 'react';
import './NotesList.css';

// PUBLIC_INTERFACE
const NotesList = ({ notes, selectedNote, onNoteSelect, onNoteEdit, onNoteDelete }) => {
  // PUBLIC_INTERFACE
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // PUBLIC_INTERFACE
  const truncateContent = (content, maxLength = 80) => {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  };

  // PUBLIC_INTERFACE
  const handleNoteClick = (note) => {
    onNoteSelect(note);
  };

  // PUBLIC_INTERFACE
  const handleEditClick = (e, note) => {
    e.stopPropagation();
    onNoteEdit(note);
  };

  // PUBLIC_INTERFACE
  const handleDeleteClick = (e, note) => {
    e.stopPropagation();
    onNoteDelete(note.id);
  };

  if (notes.length === 0) {
    return (
      <div className="notes-list-empty">
        <div className="empty-message">
          <p>No notes found</p>
          <span>Create your first note to get started</span>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-list">
      {notes.map(note => (
        <div
          key={note.id}
          className={`note-item ${selectedNote?.id === note.id ? 'selected' : ''}`}
          onClick={() => handleNoteClick(note)}
        >
          <div className="note-content">
            <h4 className="note-title">
              {note.title || 'Untitled Note'}
            </h4>
            <p className="note-preview">
              {truncateContent(note.content || 'No content')}
            </p>
            <div className="note-meta">
              <span className="note-date">
                {formatDate(note.updated_at || note.created_at)}
              </span>
            </div>
          </div>
          
          <div className="note-actions">
            <button
              onClick={(e) => handleEditClick(e, note)}
              className="note-action-btn edit-btn"
              title="Edit note"
            >
              ✏️
            </button>
            <button
              onClick={(e) => handleDeleteClick(e, note)}
              className="note-action-btn delete-btn"
              title="Delete note"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;

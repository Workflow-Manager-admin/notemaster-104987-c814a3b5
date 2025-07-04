import React from 'react';
import './NoteViewer.css';

// PUBLIC_INTERFACE
const NoteViewer = ({ note, onEdit, onDelete }) => {
  // PUBLIC_INTERFACE
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // PUBLIC_INTERFACE
  const handleEdit = () => {
    onEdit();
  };

  // PUBLIC_INTERFACE
  const handleDelete = () => {
    onDelete();
  };

  // PUBLIC_INTERFACE
  const formatContent = (content) => {
    if (!content) return '';
    
    // Convert line breaks to HTML breaks for display
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (!note) {
    return null;
  }

  return (
    <div className="note-viewer">
      <div className="viewer-header">
        <div className="note-info">
          <h1 className="note-title">
            {note.title || 'Untitled Note'}
          </h1>
          <div className="note-metadata">
            <span className="note-date">
              Created: {formatDate(note.created_at)}
            </span>
            {note.updated_at && note.updated_at !== note.created_at && (
              <span className="note-date">
                Updated: {formatDate(note.updated_at)}
              </span>
            )}
          </div>
        </div>
        
        <div className="viewer-actions">
          <button
            onClick={handleEdit}
            className="btn btn-secondary"
            title="Edit note"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
            title="Delete note"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      <div className="viewer-content">
        <div className="note-content">
          {note.content ? (
            <div className="content-text">
              {formatContent(note.content)}
            </div>
          ) : (
            <div className="content-empty">
              <p>This note is empty.</p>
              <button 
                onClick={handleEdit}
                className="btn btn-primary"
              >
                Add Content
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteViewer;

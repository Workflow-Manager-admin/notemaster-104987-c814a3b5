import React, { useState, useEffect, useRef } from 'react';
import './NoteEditor.css';

// PUBLIC_INTERFACE
const NoteEditor = ({ note, isCreating, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const titleInputRef = useRef(null);
  const contentTextareaRef = useRef(null);

  // Initialize form data
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    } else {
      setTitle('');
      setContent('');
    }
    setHasUnsavedChanges(false);
  }, [note]);

  // Focus on title input when creating new note
  useEffect(() => {
    if (isCreating && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isCreating]);

  // Track unsaved changes
  useEffect(() => {
    const originalTitle = note?.title || '';
    const originalContent = note?.content || '';
    const hasChanges = title !== originalTitle || content !== originalContent;
    setHasUnsavedChanges(hasChanges);
  }, [title, content, note]);

  // PUBLIC_INTERFACE
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // PUBLIC_INTERFACE
  const handleContentChange = (e) => {
    setContent(e.target.value);
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() && !content.trim()) {
      alert('Please enter a title or content for the note.');
      return;
    }

    setIsSaving(true);
    
    try {
      const noteData = {
        title: title.trim() || 'Untitled Note',
        content: content.trim()
      };
      
      await onSave(noteData);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  // PUBLIC_INTERFACE
  const handleKeyDown = (e) => {
    // Save with Ctrl+S or Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSubmit(e);
    }
    // Cancel with Escape
    else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="note-editor" onKeyDown={handleKeyDown}>
      <div className="editor-header">
        <h2>{isCreating ? 'Create New Note' : 'Edit Note'}</h2>
        <div className="editor-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-group">
          <label htmlFor="note-title" className="form-label">
            Title
          </label>
          <input
            ref={titleInputRef}
            type="text"
            id="note-title"
            value={title}
            onChange={handleTitleChange}
            className="form-input title-input"
            placeholder="Enter note title..."
            disabled={isSaving}
          />
        </div>

        <div className="form-group">
          <label htmlFor="note-content" className="form-label">
            Content
          </label>
          <textarea
            ref={contentTextareaRef}
            id="note-content"
            value={content}
            onChange={handleContentChange}
            className="form-textarea content-textarea"
            placeholder="Write your note here..."
            disabled={isSaving}
            rows="10"
          />
        </div>
      </form>

      {hasUnsavedChanges && (
        <div className="unsaved-indicator">
          <span>• Unsaved changes</span>
        </div>
      )}

      <div className="editor-shortcuts">
        <small>
          <kbd>Ctrl/Cmd + S</kbd> to save • <kbd>Esc</kbd> to cancel
        </small>
      </div>
    </div>
  );
};

export default NoteEditor;

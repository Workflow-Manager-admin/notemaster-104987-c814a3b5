import React, { useState, useEffect } from 'react';
import { notesAPI } from '../utils/api';
import NotesList from './NotesList';
import NoteEditor from './NoteEditor';
import NoteViewer from './NoteViewer';
import SearchBar from './SearchBar';
import './NotesApp.css';

// PUBLIC_INTERFACE
const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Filter notes based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [notes, searchQuery]);

  // PUBLIC_INTERFACE
  const loadNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedNotes = await notesAPI.getNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      console.error('Failed to load notes:', err);
      setError('Failed to load notes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setIsCreating(false);
  };

  // PUBLIC_INTERFACE
  const handleNoteEdit = (note) => {
    setSelectedNote(note);
    setIsEditing(true);
    setIsCreating(false);
  };

  // PUBLIC_INTERFACE
  const handleNoteCreate = () => {
    setSelectedNote(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  // PUBLIC_INTERFACE
  const handleNoteSave = async (noteData) => {
    try {
      let savedNote;
      if (isCreating) {
        savedNote = await notesAPI.createNote(noteData);
        setNotes(prevNotes => [savedNote, ...prevNotes]);
      } else if (selectedNote) {
        savedNote = await notesAPI.updateNote(selectedNote.id, noteData);
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === selectedNote.id ? savedNote : note
          )
        );
      }
      setSelectedNote(savedNote);
      setIsEditing(false);
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to save note:', err);
      setError('Failed to save note. Please try again.');
    }
  };

  // PUBLIC_INTERFACE
  const handleNoteDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await notesAPI.deleteNote(noteId);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      if (selectedNote && selectedNote.id === noteId) {
        setSelectedNote(null);
        setIsEditing(false);
        setIsCreating(false);
      }
    } catch (err) {
      console.error('Failed to delete note:', err);
      setError('Failed to delete note. Please try again.');
    }
  };

  // PUBLIC_INTERFACE
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // PUBLIC_INTERFACE
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    if (!selectedNote) {
      setSelectedNote(filteredNotes[0] || null);
    }
  };

  // PUBLIC_INTERFACE
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="notes-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-app">
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}
      
      <div className="notes-layout">
        {/* Sidebar */}
        <div className={`notes-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h2>My Notes</h2>
            <button 
              onClick={toggleSidebar}
              className="sidebar-toggle"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? '←' : '→'}
            </button>
          </div>
          
          {sidebarOpen && (
            <>
              <div className="sidebar-controls">
                <button 
                  onClick={handleNoteCreate}
                  className="btn btn-primary create-note-btn"
                >
                  + New Note
                </button>
                <SearchBar 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search notes..."
                />
              </div>
              
              <NotesList
                notes={filteredNotes}
                selectedNote={selectedNote}
                onNoteSelect={handleNoteSelect}
                onNoteEdit={handleNoteEdit}
                onNoteDelete={handleNoteDelete}
              />
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="notes-main">
          {!sidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="sidebar-toggle-main"
              aria-label="Open sidebar"
            >
              →
            </button>
          )}
          
          {isCreating || isEditing ? (
            <NoteEditor
              note={selectedNote}
              isCreating={isCreating}
              onSave={handleNoteSave}
              onCancel={handleCancel}
            />
          ) : selectedNote ? (
            <NoteViewer
              note={selectedNote}
              onEdit={() => handleNoteEdit(selectedNote)}
              onDelete={() => handleNoteDelete(selectedNote.id)}
            />
          ) : (
            <div className="notes-empty">
              <div className="empty-state">
                <h3>No notes selected</h3>
                <p>Select a note from the sidebar or create a new one to get started.</p>
                <button 
                  onClick={handleNoteCreate}
                  className="btn btn-primary"
                >
                  Create Your First Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesApp;

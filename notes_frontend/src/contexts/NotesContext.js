import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { notesAPI } from '../utils/api';

const NotesContext = createContext();

// PUBLIC_INTERFACE
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

// Notes reducer for managing state
const notesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_NOTES':
      return { ...state, notes: action.payload, loading: false, error: null };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? action.payload : note
        )
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload)
      };
    case 'SET_SELECTED_NOTE':
      return { ...state, selectedNote: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  notes: [],
  selectedNote: null,
  searchQuery: '',
  loading: false,
  error: null
};

// PUBLIC_INTERFACE
export const NotesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  // PUBLIC_INTERFACE
  const loadNotes = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const notes = await notesAPI.getNotes();
      dispatch({ type: 'SET_NOTES', payload: notes });
    } catch (error) {
      console.error('Failed to load notes:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load notes' });
    }
  }, []);

  // PUBLIC_INTERFACE
  const createNote = useCallback(async (noteData) => {
    try {
      const newNote = await notesAPI.createNote(noteData);
      dispatch({ type: 'ADD_NOTE', payload: newNote });
      return newNote;
    } catch (error) {
      console.error('Failed to create note:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create note' });
      throw error;
    }
  }, []);

  // PUBLIC_INTERFACE
  const updateNote = useCallback(async (noteId, noteData) => {
    try {
      const updatedNote = await notesAPI.updateNote(noteId, noteData);
      dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
      return updatedNote;
    } catch (error) {
      console.error('Failed to update note:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update note' });
      throw error;
    }
  }, []);

  // PUBLIC_INTERFACE
  const deleteNote = useCallback(async (noteId) => {
    try {
      await notesAPI.deleteNote(noteId);
      dispatch({ type: 'DELETE_NOTE', payload: noteId });
    } catch (error) {
      console.error('Failed to delete note:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete note' });
      throw error;
    }
  }, []);

  // PUBLIC_INTERFACE
  const setSelectedNote = useCallback((note) => {
    dispatch({ type: 'SET_SELECTED_NOTE', payload: note });
  }, []);

  // PUBLIC_INTERFACE
  const setSearchQuery = useCallback((query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  // PUBLIC_INTERFACE
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Get filtered notes based on search query
  const filteredNotes = state.searchQuery.trim()
    ? state.notes.filter(note =>
        note.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    : state.notes;

  const value = {
    ...state,
    filteredNotes,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    setSelectedNote,
    setSearchQuery,
    clearError
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

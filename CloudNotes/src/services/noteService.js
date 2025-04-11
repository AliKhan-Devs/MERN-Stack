import api from './api';
import toast from 'react-hot-toast';

export const getNotes = async () => {
  try {
    const response = await api.get('/api/notes');
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch notes');
    throw error;
  }
};

export const createNote = async (noteData) => {
  try {
    const response = await api.post('/api/notes', noteData);
    toast.success('Note created successfully');
    return response.data;
  } catch (error) {
    toast.error('Failed to create note');
    throw error;
  }
};

export const updateNote = async (id, noteData) => {
  try {
    const response = await api.put(`/api/notes/${id}`, noteData);
    toast.success('Note updated successfully');
    return response.data;
  } catch (error) {
    toast.error('Failed to update note');
    throw error;
  }
};

export const deleteNote = async (id) => {
  try {
    await api.delete(`/api/notes/${id}`);
    toast.success('Note deleted successfully');
    return true;
  } catch (error) {
    toast.error('Failed to delete note');
    throw error;
  }
};
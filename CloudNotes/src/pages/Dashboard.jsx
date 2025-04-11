import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotes, createNote, updateNote, deleteNote } from '../services/noteService';
import NoteCard from '../components/NoteCard';
import CreateNoteForm from '../components/CreateNoteForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SortAsc, SortDesc, Grid, List } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      const newNote = await createNote(noteData);
      setNotes([newNote, ...notes]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    try {
      const updatedNote = await updateNote(id, noteData);
      setNotes(notes.map(note => note._id === id ? updatedNote : note));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort notes based on sort order
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {currentUser?.name || 'User'}!
            </p>
          </div>
        </div>

        <CreateNoteForm onCreateNote={handleCreateNote} />

        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? (
                <>
                  <SortAsc size={18} className="mr-1" />
                  <span className="hidden sm:inline">Oldest First</span>
                </>
              ) : (
                <>
                  <SortDesc size={18} className="mr-1" />
                  <span className="hidden sm:inline">Newest First</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              {viewMode === 'grid' ? (
                <>
                  <List size={18} className="mr-1" />
                  <span className="hidden sm:inline">List View</span>
                </>
              ) : (
                <>
                  <Grid size={18} className="mr-1" />
                  <span className="hidden sm:inline">Grid View</span>
                </>
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : sortedNotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No notes match your search.' : 'You have no notes yet. Create one to get started!'}
            </p>
          </div>
        ) : (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            <AnimatePresence>
              {sortedNotes.map(note => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onDelete={handleDeleteNote}
                  onUpdate={handleUpdateNote}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
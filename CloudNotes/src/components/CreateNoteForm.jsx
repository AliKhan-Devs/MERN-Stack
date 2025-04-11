import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateNoteForm = ({ onCreateNote }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;
    
    onCreateNote({ title, content });
    
    // Reset form
    setTitle('');
    setContent('');
    setIsFormOpen(false);
  };

  return (
    <div className="mb-8">
      {!isFormOpen ? (
        <motion.button
          className="btn-primary flex items-center justify-center w-full"
          onClick={() => setIsFormOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} className="mr-2" />
          Create New Note
        </motion.button>
      ) : (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Create New Note</h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                className="input min-h-[100px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter note content"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Note
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default CreateNoteForm;
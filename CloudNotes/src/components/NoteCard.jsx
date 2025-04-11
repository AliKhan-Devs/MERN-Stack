import React, { useState } from 'react';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

const NoteCard = ({ note, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleSave = () => {
    onUpdate(note._id, {
      title: editedTitle,
      content: editedContent
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(note.title);
    setEditedContent(note.content);
    setIsEditing(false);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div 
      className="note-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      {isEditing ? (
        <>
          <input
            type="text"
            className="input mb-2"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Note Title"
          />
          <textarea
            className="input min-h-[100px] mb-4"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Note Content"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <X size={16} className="mr-1" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <Save size={16} className="mr-1" />
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{note.title}</h3>
          <p className="text-gray-600 mb-4">{note.content}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {formatDate(note.createdAt)}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(note._id)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default NoteCard;
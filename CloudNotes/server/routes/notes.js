import express from 'express';
import { 
  getNotes, 
  getNoteById, 
  createNote, 
  updateNote, 
  deleteNote 
} from '../controllers/noteController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/notes
// @desc    Get all notes for current user
// @access  Private
router.get('/', getNotes);

// @route   GET /api/notes/:id
// @desc    Get a note by ID
// @access  Private
router.get('/:id', getNoteById);

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', createNote);

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', updateNote);

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', deleteNote);

export default router;
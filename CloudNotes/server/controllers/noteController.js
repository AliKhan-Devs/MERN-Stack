import Note from '../models/Note.js';

// Get all notes for the current user
export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

// Get a single note by ID
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if the note belongs to the current user
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this note' });
    }
    
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// Create a new note
export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    
    const note = new Note({
      title,
      content,
      user: req.user.id
    });
    
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
};

// Update a note
export const updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    
    let note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if the note belongs to the current user
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }
    
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// Delete a note
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if the note belongs to the current user
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }
    
    await Note.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};
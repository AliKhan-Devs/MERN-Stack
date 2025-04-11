import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';

// Load environment variables otherwise if we access env variables using process.env we will get an undefined value
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use morgan for logging requests and their details to the console
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CloudNotes API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // this prints full error stack to the console which help in debugging
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
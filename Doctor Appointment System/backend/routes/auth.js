import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { uploadImage } from '../utils/cloudinary.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to get avatar URL
const getAvatarUrl = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
};

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let profilePicture = null;
    
    if (profileImage) {
      try {
        // If a base64 image is provided, upload it to Cloudinary
        profilePicture = await uploadImage(profileImage);
      } catch (error) {
        console.error('Failed to upload image:', error);
        // If image upload fails, don't set a profile picture
        // The frontend will use the avatar API URL
      }
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: 'patient',
      profilePicture // This will be null if no image was uploaded
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || getAvatarUrl(user.name)
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Register Doctor
router.post('/register/doctor', async (req, res) => {
  try {
    const { name, email, password, specialization, secretKey, profileImage } = req.body;

    // Verify doctor secret key
    if (secretKey !== process.env.DOCTOR_SECRET_KEY) {
      return res.status(400).json({ message: 'Invalid secret key for doctor registration' });
    }

    // Check if doctor already exists
    let doctor = await User.findOne({ email });
    if (doctor) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    let profilePicture = null;

    if (profileImage) {
      try {
        // If a base64 image is provided, upload it to Cloudinary
        profilePicture = await uploadImage(profileImage);
      } catch (error) {
        console.error('Failed to upload image:', error);
        // If image upload fails, don't set a profile picture
        // The frontend will use the avatar API URL
      }
    }

    // Create new doctor
    doctor = new User({
      name,
      email,
      password,
      role: 'doctor',
      specialization,
      profilePicture // This will be null if no image was uploaded
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(password, salt);

    await doctor.save();

    // Create JWT token
    const payload = {
      user: {
        id: doctor.id,
        role: doctor.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        specialization: doctor.specialization,
        profilePicture: doctor.profilePicture || getAvatarUrl(doctor.name)
      }
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({ message: 'Server error during doctor registration' });
  }
});

// Login User/Doctor
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        profilePicture: user.profilePicture || getAvatarUrl(user.name)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify Token
router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialization: user.specialization,
      profilePicture: user.profilePicture || getAvatarUrl(user.name)
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error during token verification' });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  try {
    console.log('Profile update request received:', req.body);
    const { name, specialization, profileImage } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let updates = {};

    // Update name if provided
    if (name) {
      updates.name = name;
    }

    // Update specialization if user is a doctor and specialization is provided
    if (user.role === 'doctor' && specialization) {
      updates.specialization = specialization;
    }

    // Handle profile picture update
    if (profileImage) {
      try {
        console.log('Uploading new profile image');
        const profilePicture = await uploadImage(profileImage);
        updates.profilePicture = profilePicture;
      } catch (error) {
        console.error('Failed to upload new profile image:', error);
        return res.status(400).json({ message: 'Failed to upload profile image' });
      }
    }

    console.log('Updating user with:', updates);

    // Use findByIdAndUpdate to ensure atomic update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User updated successfully:', {
      name: updatedUser.name,
      specialization: updatedUser.specialization,
      hasProfilePicture: !!updatedUser.profilePicture
    });

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      specialization: updatedUser.specialization,
      profilePicture: updatedUser.profilePicture || getAvatarUrl(updatedUser.name)
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

export default router;
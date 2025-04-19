import express from 'express';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all doctors');
    const doctors = await User.find({ role: 'doctor' })
      .select('name email specialization profilePicture');
    console.log('Found doctors:', doctors);
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor statistics
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const totalAppointments = await Appointment.countDocuments({ doctor: req.user.id });
    const completedAppointments = await Appointment.countDocuments({ 
      doctor: req.user.id,
      status: 'completed'
    });
    const pendingAppointments = await Appointment.countDocuments({ 
      doctor: req.user.id,
      status: 'pending'
    });

    // Get monthly appointments data for charts
    const monthlyData = await Appointment.aggregate([
      { $match: { doctor: req.user.id } },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      monthlyData
    });
  } catch (error) {
    console.error('Error fetching doctor stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
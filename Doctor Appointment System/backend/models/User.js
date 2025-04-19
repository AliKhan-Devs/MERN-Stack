import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['patient', 'doctor'],
    required: true
  },
  specialization: {
    type: String,
    required: function() {
      return this.role === 'doctor';
    }
  },
  profilePicture: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
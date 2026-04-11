const mongoose = require('mongoose');

const bomItemSchema = new mongoose.Schema({
  hardware_name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  notes: { type: String, default: '' },
}, { _id: false });

const projectRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: 200,
  },
  raw_description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: 5000,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  extrapolated_BOM: {
    type: [bomItemSchema],
    default: [],
  },
  required_skills: [{
    type: String,
    trim: true,
  }],
  matched_hardware: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HardwareItem',
  }],
  matched_mentors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['draft', 'parsed', 'matching', 'matched', 'in_progress', 'completed'],
    default: 'draft',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ProjectRequest', projectRequestSchema);

const mongoose = require('mongoose');

const hardwareItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hardware name is required'],
    trim: true,
    maxlength: 150,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 2000,
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  availability_status: {
    type: String,
    enum: ['available', 'in-use', 'maintenance'],
    default: 'available',
  },
  category: {
    type: String,
    enum: ['compute', 'sensor', 'networking', 'storage', 'display', 'power', 'other'],
    default: 'other',
  },
  specs: {
    type: Map,
    of: String,
    default: {},
  },
  item_description_embedding: {
    type: [Number],
    default: [],
    select: false,
  },
  image_url: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Index for geospatial queries
hardwareItemSchema.index({ location: '2dsphere' });
// Text index for keyword search fallback
hardwareItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('HardwareItem', hardwareItemSchema);

const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  area: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  baths: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: {
    type: [String]
  },
  images: {
    type: [String]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;

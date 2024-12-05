const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
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

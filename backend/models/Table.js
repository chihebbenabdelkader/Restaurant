const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
 restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: false,
  
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  qrCodeUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Table', tableSchema);
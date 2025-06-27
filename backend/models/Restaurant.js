// models/Restaurant.js
const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async function (value) {
        const User = require('./User');
        const user = await User.findById(value);
        return user && user.role === 'admin';
      },
      message: 'adminId must refer to a user with role "admin"',
    },
  },
  // Add more fields as needed, e.g., address, phone, description...
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);

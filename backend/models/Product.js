const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {  // ← Add this field
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
      // restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },

    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

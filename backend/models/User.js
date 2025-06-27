const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
        emailToken: {
      type: String,
     
     },
    username: {
      type: String,
      required: false,
    },
   
    email: {
      type: String,
      required: true,
      unique: true,
    },
  
  
    role: {
      type: String,
      default: "client",
      enum: ["super-admin", "client", "admin"],
    },
 
    token: {
      type: String,
      default: "",
   },

    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
   
    photo: {
      type: String,
      default: "https://fastuz.s3.eu-central-1.amazonaws.com/default.png",
    },
  
  

    active: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
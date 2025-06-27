const User = require("../models/User");
const bcrypt = require('bcrypt');
const sendEmail = require("../utils/mailer");


exports.createAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({ message: 'Only super-admins can create admin accounts' });
    }

    const { nom, prenom, username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      nom,
      prenom,
      username,
      email,
      password: hashedPassword,
      role: 'admin',
      active: true
    });

    await newAdmin.save();

      // Send email
    await sendEmail({
      to: email,
      subject: "Your Admin Account Credentials",
      text: `Hello ${prenom},\n\nYour admin account has been created.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login and change your password as soon as possible.`,
    });

    res.status(201).json({ message: 'Admin account created successfully', user: newAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


 exports.getUsers = async (req, res) => {

 try {
    const admins = await User.find({role:"admin"}).select("-password"); // don't send passwords
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
   
}


exports.toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;

    // Optional: restrict to super-admins
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({ message: 'Only super-admins can change user status' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.active = !user.active;
    await user.save();

    res.status(200).json({ message: 'User status updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


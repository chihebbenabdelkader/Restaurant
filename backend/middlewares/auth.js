const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Utilise le même secret que pour la génération

const user = await User.findById(decoded.id || decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user; // 👈 Important : injecte l'utilisateur dans la requête
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyToken;

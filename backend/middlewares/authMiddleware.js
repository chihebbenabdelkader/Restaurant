// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assurez-vous du bon chemin

exports.requireSignIn = (req, res, next) => {
    try {
        // Récupérer le token du header (ou des cookies)
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Accès refusé. Pas de token fourni.' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Stocke les infos de l'utilisateur décodées
         console.log("req.user dans requireSignIn:", req.user);
        next();
    } catch (err) {
        console.error("Erreur d'authentification :", err);
        res.status(401).json({ message: 'Token invalide ou expiré.' });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId); // req.user vient de requireSignIn
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs sont autorisés.' });
        }
    } catch (err) {
        console.error("Erreur de rôle isAdmin :", err);
        res.status(500).json({ message: 'Erreur serveur lors de la vérification du rôle.' });
    }
};
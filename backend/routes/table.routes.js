const express = require('express');
const router = express.Router();
const tableController = require('../controllers/table.controller'); // Assurez-vous que le chemin est correct
const authMiddleware = require('../middlewares/authMiddleware'); // Assurez-vous d'avoir un middleware d'authentification



router.get('/table', authMiddleware.requireSignIn, authMiddleware.isAdmin, tableController.getTablesByAdmin);

router.get('/table/:restaurantId', authMiddleware.requireSignIn, authMiddleware.isAdmin, tableController.getTablesByRestaurant);

router.post('/addTable', authMiddleware.requireSignIn, authMiddleware.isAdmin, tableController.createTable);

// Mettre à jour une table spécifique par son ID
router.put('/table/:id', authMiddleware.requireSignIn, authMiddleware.isAdmin, tableController.updateTable);

// Supprimer une table spécifique par son ID
router.delete('/table/:id', authMiddleware.requireSignIn, authMiddleware.isAdmin, tableController.deleteTable);

module.exports = router;
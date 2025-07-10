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

router.get('/public-menu/:adminId/:tableNumber', async (req, res) => {
  const { adminId, tableNumber } = req.params;

  try {
    // Exemple: récupérer la table avec adminId et tableNumber
    const table = await tableController.getTableByAdminAndNumber(adminId, tableNumber);
    if (!table) {
      return res.status(404).send("Table not found");
    }

    // Ici, tu peux envoyer une page HTML, ou rediriger, ou envoyer des données JSON.
    // Exemple simple d'envoi JSON :
    res.json({
      message: "Public menu page",
      adminId,
      tableNumber,
      table
    });

    // Si tu as un frontend pour la page public-menu, tu peux rendre un template ou rediriger
    // res.render('publicMenuPage', { adminId, tableNumber, table });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
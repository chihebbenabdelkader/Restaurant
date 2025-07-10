const Table = require('../models/Table');
const Restaurant = require('../models/Restaurant'); // Assurez-vous du bon chemin si vous l'utilisez

exports.createTable = async (req, res) => {
  try {
            console.log("req.user au début de createTable:", req.user); // Vérifiez la présence de req.user ici

    const { quantity, restaurantId } = req.body; // Récupérez 'quantity' au lieu de 'number'
    const adminId = req.user.userId; // <-- CORRECTION ICI : Utilisez req.user.userId
        console.log("adminId extrait:", adminId); // Affiche l'ID extrait

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'La quantité de tables doit être un nombre positif.' });
    }

    // Optionnel: Vérifier que l'admin est bien lié au restaurant si restaurantId est utilisé
    let restaurant = null;
    if (restaurantId) {
      restaurant = await Restaurant.findOne({ _id: restaurantId, adminId });
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant non trouvé ou non autorisé.' });
      }
    }

    // Trouver le numéro de table le plus élevé existant pour cet administrateur (et restaurant si applicable)
    const filter = { adminId };
    if (restaurantId) {
      filter.restaurantId = restaurantId;
    }

    const lastTable = await Table.findOne(filter).sort({ number: -1 }).exec();
    const startNumber = lastTable ? parseInt(lastTable.number) + 1 : 1; // Commence à 1 si aucune table n'existe

    const createdTables = [];
    for (let i = 0; i < quantity; i++) {
      const tableNumber = (startNumber + i).toString(); // Convertir en string si 'number' est de type String

      const newTable = new Table({
        number: tableNumber,
        adminId : adminId,
        restaurantId: restaurantId || null,
        // qrCodeUrl sera généré plus tard, ou vous pouvez le faire ici
        qrCodeUrl: `http://localhost:5173/public-menu/${adminId}/${tableNumber}`,
        // qrCodeUrl: `http://192.168.1.143:5001/api/public-menu/${adminId}/${tableNumber}`,

      });
      await newTable.save();
      createdTables.push(newTable);
    }

    res.status(201).json({
      message: `${quantity} table(s) ajoutée(s) avec succès.`,
      tables: createdTables
    });

  } catch (err) {
    console.error("Erreur lors de l'ajout automatique des tables :", err);
    // Gérer l'erreur pour les numéros de table non uniques si le schéma l'exige
    if (err.code === 11000) { // Erreur de duplicata de clé MongoDB
        return res.status(409).json({ message: 'Un numéro de table existe déjà ou une contrainte d\'unicité a été violée.' });
    }
    res.status(500).json({ message: 'Erreur serveur lors de l\'ajout des tables.' });
  }
};

exports.getTablesByAdmin = async (req, res) => {
  try {
    const adminId = req.user.userId; // <-- CORRECTION ICI
    const tables = await Table.find({ adminId });
    res.status(200).json(tables);
  } catch (err) {
    console.error("Erreur lors de la récupération des tables par admin :", err);
    res.status(500).json({ message: 'Erreur lors de la récupération des tables.' });
  }
};

exports.getTablesByRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const adminId = req.user.userId; // <-- CORRECTION ICI
    const tables = await Table.find({ restaurantId, adminId }); // Filtrez par adminId pour la sécurité
    res.status(200).json(tables);
  } catch (err) {
    console.error("Erreur lors de la récupération des tables par restaurant :", err);
    res.status(500).json({ message: 'Erreur lors de la récupération des tables.' });
  }
};

exports.updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { number, restaurantId /*, ...autres_champs */ } = req.body;
    const adminId = req.user.userId; // <-- CORRECTION ICI

    // Assurez-vous que la table appartient bien à l'admin et au restaurant (si applicable)
    const filter = { _id: id, adminId };
    if (restaurantId) {
        filter.restaurantId = restaurantId;
    }

    const table = await Table.findOne(filter);
    if (!table) {
      return res.status(404).json({ message: 'Table non trouvée ou non autorisée.' });
    }

    // Mise à jour des champs
    if (number) table.number = number;
    // Mettre à jour d'autres champs si vous les ajoutez au modèle de Table

    await table.save();
    res.status(200).json(table);
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la table :", err);
    // Gérer l'erreur de duplicata si le numéro de table est unique
    if (err.code === 11000) {
        return res.status(409).json({ message: 'Le numéro de table est déjà utilisé.' });
    }
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la table.' });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.userId; // <-- CORRECTION ICI

    // Assurez-vous que la table appartient bien à l'admin
    const table = await Table.findOneAndDelete({ _id: id, adminId });
    if (!table) {
      return res.status(404).json({ message: 'Table non trouvée ou non autorisée.' });
    }

    res.status(200).json({ message: 'Table supprimée avec succès.' });
  } catch (err) {
    console.error("Erreur lors de la suppression de la table :", err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de la table.' });
  }
};

// ===== controllers/menu.controller.js ===== (Votre fonction existante de menu.controller.js)
// Je l'ai incluse ici pour référence, mais elle devrait rester dans son propre fichier 'menu.controller.js'
// et être requise séparément dans le fichier de routes approprié.
exports.getMenuByTable = async (req, res) => {
  const { restaurantId, tableNumber } = req.params;

  try {
    // Logique d'accès au menu lié au restaurant et à la table
    // (Cette partie nécessitera une implémentation plus complète pour récupérer le vrai menu)
    res.status(200).json({
      menu: `Menu pour le restaurant ${restaurantId}, table ${tableNumber}`
    });
  } catch (err) {
    console.error("Erreur lors de la récupération du menu par table :", err);
    res.status(500).json({ message: 'Erreur lors de la récupération du menu.' });
  }
};
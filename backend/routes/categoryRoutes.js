const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyToken = require("../middlewares/auth");

router.post('/category', verifyToken, categoryController.createCategory);
router.get('/category', verifyToken, categoryController.getCategoriesByAdmin);
router.delete('/category/:id', verifyToken, categoryController.deleteCategory);
router.put('/category/:id', verifyToken, categoryController.updateCategory); // <-- PUT update

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const categoryController = require('../controllers/categoryController');
// const verifyToken = require("../middlewares/auth");

// router.post('/category', verifyToken, categoryController.createCategory);
// // Expect restaurantId in req.body for POST

// router.get('/category', verifyToken, categoryController.getCategoriesByAdminAndRestaurant);
// // Expect restaurantId in query string: /category?restaurantId=...

// router.delete('/category/:id', verifyToken, categoryController.deleteCategory);
// // Expect restaurantId in query string: /category/:id?restaurantId=...

// router.put('/category/:id', verifyToken, categoryController.updateCategory);
// // Expect restaurantId in req.body for PUT

// module.exports = router;

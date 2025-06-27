// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const verifyToken = require("../middlewares/auth");

// router.post('/product', verifyToken, productController.createProduct);
// router.get('/product', verifyToken, productController.getProductsByAdmin);
// router.delete('/product/:id', verifyToken, productController.deleteProduct);
// router.put('/product/:id', verifyToken, productController.updateProduct); // <-- PUT update

// module.exports = router;


const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productController = require('../controllers/productController');
const verifyToken = require("../middlewares/auth");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g. 1234567890.png
  },
});

const upload = multer({ storage });

// POST create product with image upload
router.post("/product", verifyToken, upload.single("image"), productController.createProduct);

// PUT update product with image upload
router.put("/product/:id", verifyToken,upload.single("image"), productController.updateProduct);

// router.post('/product', verifyToken, productController.createProduct);
router.get('/product', verifyToken, productController.getProductsByAdmin);
router.delete('/product/:id', verifyToken, productController.deleteProduct);
// router.put('/product/:id', verifyToken, productController.updateProduct); // <-- PUT update



module.exports = router;


// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const productController = require('../controllers/productController');
// const verifyToken = require("../middlewares/auth");

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });

// // POST create product with image upload
// // Expect restaurantId in req.body
// router.post("/product", verifyToken, upload.single("image"), productController.createProduct);

// // PUT update product with image upload
// // Expect restaurantId in req.body
// router.put("/product/:id", verifyToken, upload.single("image"), productController.updateProduct);

// // GET products by admin & restaurant
// // Expect restaurantId in query string: /product?restaurantId=...
// router.get('/product', verifyToken, productController.getProductsByAdminAndRestaurant);

// // DELETE product by id, scoped by restaurantId
// // Expect restaurantId in query string: /product/:id?restaurantId=...
// router.delete('/product/:id', verifyToken, productController.deleteProduct);

// module.exports = router;

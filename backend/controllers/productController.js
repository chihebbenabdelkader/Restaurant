const Product = require('../models/Product');



exports.getProductsByAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const products = await Product.find({ adminId }).populate('categoryId');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;
    const adminId = req.user.id;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const product = new Product({
      name,
      description,
      price,
      categoryId,
      adminId,
      image,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;
    const adminId = req.user.id;

    const product = await Product.findOne({ _id: id, adminId });

    if (!product) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.categoryId = categoryId || product.categoryId;

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};





// exports.getProductsByAdminAndRestaurant = async (req, res) => {
//   try {
//     const adminId = req.user.id;
//     const { restaurantId } = req.query;

//     if (!restaurantId) {
//       return res.status(400).json({ message: "restaurantId query param is required" });
//     }

//     const products = await Product.find({ adminId, restaurantId }).populate('categoryId');
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const adminId = req.user.id;
//     const { restaurantId } = req.query;

//     if (!restaurantId) {
//       return res.status(400).json({ message: "restaurantId query param is required" });
//     }

//     const product = await Product.findOneAndDelete({ _id: id, adminId, restaurantId });

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found or unauthorized' });
//     }

//     res.json({ message: 'Product deleted' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// exports.createProduct = async (req, res) => {
//   try {
//     const { name, description, price, categoryId, restaurantId } = req.body;
//     const adminId = req.user.id;

//     if (!restaurantId) {
//       return res.status(400).json({ message: "restaurantId is required" });
//     }

//     const image = req.file ? `/uploads/${req.file.filename}` : null;

//     const product = new Product({
//       name,
//       description,
//       price,
//       categoryId,
//       adminId,
//       restaurantId,
//       image,
//     });

//     await product.save();
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// exports.updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description, price, categoryId, restaurantId } = req.body;
//     const adminId = req.user.id;

//     if (!restaurantId) {
//       return res.status(400).json({ message: "restaurantId is required" });
//     }

//     const product = await Product.findOne({ _id: id, adminId, restaurantId });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found or unauthorized" });
//     }

//     product.name = name || product.name;
//     product.description = description || product.description;
//     product.price = price || product.price;
//     product.categoryId = categoryId || product.categoryId;

//     if (req.file) {
//       product.image = `/uploads/${req.file.filename}`;
//     }

//     await product.save();

//     res.json(product);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
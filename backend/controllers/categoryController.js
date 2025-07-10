const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const adminId = req.user.id; // assuming you attach user from token

    const category = new Category({ name, adminId });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCategoriesByAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const categories = await Category.find({ adminId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const adminId = req.user.id;

    // Find the category by id and adminId (to ensure ownership)
    const category = await Category.findOne({ _id: id, adminId });

    if (!category) {
      return res.status(404).json({ message: 'Category not found or unauthorized' });
    }

    category.name = name || category.name;
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getPublicCategoriesByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params; // adminId vient de l'URL ici
    const categories = await Category.find({ adminId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// exports.createCategory = async (req, res) => {
//   try {
//     const { name, restaurantId } = req.body;
//     const adminId = req.user.id;

//     if (!restaurantId) {
//       return res.status(400).json({ message: "restaurantId is required" });
//     }

//     const category = new Category({ name, adminId, restaurantId });
//     await category.save();

//     res.status(201).json(category);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// exports.getCategoriesByAdminAndRestaurant = async (req, res) => {
//   try {
//     const adminId = req.user.id;
//     const { restaurantId } = req.query;

//     if (!restaurantId) {
//       return res.status(400).json({ message: "restaurantId query param is required" });
//     }

//     const categories = await Category.find({ adminId, restaurantId });
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.deleteCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const adminId = req.user.id;
//     const { restaurantId } = req.query;

//     if (!restaurantId) {
//       return res.status(400).json({ message: "restaurantId query param is required" });
//     }

//     // Only delete if category belongs to admin and restaurant
//     const category = await Category.findOneAndDelete({ _id: id, adminId, restaurantId });

//     if (!category) {
//       return res.status(404).json({ message: "Category not found or unauthorized" });
//     }

//     res.json({ message: 'Category deleted' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// exports.updateCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, restaurantId } = req.body;
//     const adminId = req.user.id;

//     if (!restaurantId) {
//       return res.status(400).json({ message: "restaurantId is required" });
//     }

//     const category = await Category.findOne({ _id: id, adminId, restaurantId });

//     if (!category) {
//       return res.status(404).json({ message: 'Category not found or unauthorized' });
//     }

//     category.name = name || category.name;
//     await category.save();

//     res.json(category);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

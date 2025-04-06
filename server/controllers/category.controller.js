const Category = require("../models/category.model.js");
const Product = require("../models/product.model.js");

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    
    // Count products for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          categories: { $in: [category.name] }
        });
        
        return {
          _id: category._id,
          name: category.name,
          description: category.description,
          productCount,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        };
      })
    );
    
    res.status(200).json({
      message: "Categories fetched successfully",
      categories: categoriesWithCounts
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      message: "Error fetching categories",
      error: error.message
    });
  }
};

// Get a single category by id
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    const productCount = await Product.countDocuments({
      categories: { $in: [category.name] }
    });
    
    res.status(200).json({
      message: "Category fetched successfully",
      category: {
        ...category._doc,
        productCount
      }
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      message: "Error fetching category",
      error: error.message
    });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category with this name already exists" });
    }
    
    // Create new category
    const category = new Category({
      name,
      description: description || ''
    });
    
    await category.save();
    
    res.status(201).json({
      message: "Category created successfully",
      category
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      message: "Error creating category",
      error: error.message
    });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const categoryId = req.params.id;
    
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    // Check if the new name already exists (but ignore if it's the same category)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: "Category with this name already exists" });
      }
    }
    
    // Update the category fields if provided
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    
    await category.save();
    
    res.status(200).json({
      message: "Category updated successfully",
      category
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      message: "Error updating category",
      error: error.message
    });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    // Check if any products are using this category before deleting
    const productsWithCategory = await Product.countDocuments({
      categories: { $in: [category.name] }
    });
    
    if (productsWithCategory > 0) {
      return res.status(400).json({
        message: `Cannot delete category. It is used by ${productsWithCategory} products.`
      });
    }
    
    await Category.findByIdAndDelete(categoryId);
    
    res.status(200).json({
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      message: "Error deleting category",
      error: error.message
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
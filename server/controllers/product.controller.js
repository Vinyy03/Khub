const Product = require("../models/product.model.js");
const Category = require("../models/category.model.js");

const createProduct = async (req, res) => {
    try {
      const { name, description, price, categories, image } = req.body;
      
      // Validate required fields
      if (!name || !description || !price) {
        return res.status(400).json({ message: "Name, description and price are required" });
      }

    // Process categories - can be comma-separated string or array
    let categoryArray = [];
    if (categories) {
      if (typeof categories === "string") {
        categoryArray = categories.split(",").map((cat) => cat.trim());
      } else if (Array.isArray(categories)) {
        categoryArray = categories;
      }
    }

    // Validate that categories exist in database
    if (categoryArray.length > 0) {
      const existingCategories = await Category.find({
        name: { $in: categoryArray },
      });
      const existingCategoryNames = existingCategories.map((cat) => cat.name);

      // Check if any categories don't exist
      const invalidCategories = categoryArray.filter(
        (cat) => !existingCategoryNames.includes(cat)
      );
      if (invalidCategories.length > 0) {
        return res.status(400).json({
          message: `The following categories don't exist: ${invalidCategories.join(
            ", "
          )}`,
        });
      }
    }

    // Create and save new product with image URL from request body if available
    const newProduct = new Product({
        name,
        title: name,
        description,
        price,
        categories: categoryArray,
        // Use image URL from request body if available and it's a URL
        image: (image && image.startsWith('http')) 
          ? image 
          : (req.file 
            ? req.file.path 
            : `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/v1/kgrillhub_products/default-product`)
      });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

// Update a product
// Update a product
const updateProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const { name, description, price, categories, image } = req.body;
      
      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Process categories - can be comma-separated string or array
      let categoryArray = [];
      if (categories) {
        if (typeof categories === "string") {
          categoryArray = categories.split(",").map((cat) => cat.trim());
        } else if (Array.isArray(categories)) {
          categoryArray = categories;
        }
      }
  
      // Build update object
      const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (name !== undefined) updateData.title = name; // Also update title
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (categories !== undefined) updateData.categories = categoryArray;
    
      // Handle image - prioritize image URL from request body
      if (image && image.startsWith('http')) {
        updateData.image = image;
      } else if (req.file) {
        updateData.image = req.file.path;
      }
  
      // Update product
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: updateData },
        { new: true }
      );
  
      res.status(200).json({
        message: "Product updated successfully",
        updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({
        message: "Error updating product",
        error: error.message,
      });
    }
  };

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const { latest, category } = req.query;

    let products;

    if (latest) {
      products = await Product.find()
        .sort({ createdAt: -1 })
        .limit(parseInt(latest));
    } else if (category) {
      products = await Product.find({
        categories: { $in: [category] },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
};

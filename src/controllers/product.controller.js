const Product = require("../models/product.model");

// Get all products with filtering, sorting, and pagination
exports.getProducts = async (req, res) => {
    try {
        const { category, price, page = 1, limit = 10 } = req.query;

        // Filtering by category
        let filter = {};
        if (category) {
            filter.category = category;
        }

        // Sorting by price (asc or desc)
        let sortOption = {};
        if (price) {
            if (price === "asc") {
                sortOption.price = 1;
            } else if (price === "desc") {
                sortOption.price = -1;
            }
        }

        // Pagination
        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({
            total: totalProducts,
            page: Number(page),
            limit: Number(limit),
            products
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, price, category, stock, description } = req.body;
        if (!name || !price || !category || !stock || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newProduct = new Product({ name, price, category, stock, description });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

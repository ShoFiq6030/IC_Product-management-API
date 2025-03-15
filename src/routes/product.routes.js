const express = require("express");
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");

const { authenticate } = require("../middlewares/user.middleware");
const authorizeRole = require("../middlewares/authorizeRole");


// ✅ Public routes (No authentication required)
router.get("/", getProducts);
router.get("/:id", getProductById);

// ✅ Protected routes (Only Admins can modify products)
router.post("/", authenticate, authorizeRole("admin"), createProduct);
router.put("/:id", authenticate, authorizeRole("admin"), updateProduct);
router.delete("/:id", authenticate, authorizeRole("admin"), deleteProduct);



module.exports = router;

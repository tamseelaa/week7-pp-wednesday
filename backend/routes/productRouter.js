// routes/productRouter.js
const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const auth = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllProducts);
router.get("/:productId", getProductById);

// PROTECTED ROUTES
router.post("/", auth, createProduct);
router.put("/:productId", auth, updateProduct);
router.delete("/:productId", auth, deleteProduct);

module.exports = router;

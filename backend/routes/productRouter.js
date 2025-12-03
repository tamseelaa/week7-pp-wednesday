const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");

const auth = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC
router.get("/", getAllProducts);
router.get("/:productId", getProductById);

// PROTECTED
router.post("/", auth, createProduct);
router.put("/:productId", auth, updateProduct);
router.delete("/:productId", auth, deleteProduct);

module.exports = router;

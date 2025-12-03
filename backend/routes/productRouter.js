const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");

// GET all products
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// POST create a product
router.post("/", async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

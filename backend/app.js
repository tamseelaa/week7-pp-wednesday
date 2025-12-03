// app.js
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const { unknownEndpoint, errorHandler } = require("./middleware/customMiddleware");

app.use(cors());
app.use(express.json());

// ❌ Remove connectDB() in test environment
if (process.env.NODE_ENV !== "test") {
  const connectDB = require("./config/db");
  connectDB();
}

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;

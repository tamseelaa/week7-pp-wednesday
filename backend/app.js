require('dotenv').config();
const express = require("express");
const app = express();
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const { unknownEndpoint, errorHandler } = require("./middleware/customMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Use the productRouter for all "/products" routes
app.use("/api/products", productRouter);
// Use the userRouter for all "/jobs" routes
app.use("/api/users", userRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;

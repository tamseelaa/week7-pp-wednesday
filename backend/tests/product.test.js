// backend/tests/product.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = require("../app");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// ⬇️ ⬇️ IMPORTANT: CONNECT TO TEST DB BEFORE ALL TESTS ⬇️ ⬇️
beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Helper: create user with role + JWT
const createUserAndToken = async (role = "Admin") => {
  const password = "Password123!";
  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: "Test User",
    email: `${role.toLowerCase()}@example.com`,
    password: hash,
    role,
    address: "123 Test Street",
  });

  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.SECRET,
    { expiresIn: "3d" }
  );

  return { user, token };
};

// Sample product payload
const sampleProduct = {
  title: "Test Product",
  category: "Electronics",
  description: "A very nice test product",
  price: 99.99,
  stockQuantity: 10,
  supplier: {
    name: "Test Supplier",
    contactEmail: "supplier@example.com",
    contactPhone: "1234567890",
    rating: 4,
  },
};

describe("Products API - protected routes", () => {
  let adminToken;

  beforeEach(async () => {
    await Product.deleteMany({});
    await User.deleteMany({});
    adminToken = (await createUserAndToken("Admin")).token;
  });

  // Clean up DB and connection after all tests
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  // ---------- POST /api/products ----------
  test("POST /api/products - fails without token", async () => {
    const res = await request(app).post("/api/products").send(sampleProduct);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/authorization token required/i);
  });

  test("POST /api/products - fails with invalid token", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", "Bearer invalid.token.here")
      .send(sampleProduct);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/not authorized/i);
  });

  test("POST /api/products - succeeds with valid token (Admin)", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(sampleProduct);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(sampleProduct.title);
  });

  test("POST /api/products - succeeds with valid token (Seller role)", async () => {
    const { token } = await createUserAndToken("Seller");

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send(sampleProduct);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(sampleProduct.title);
  });

  // ---------- PUT /api/products/:id ----------
  test("PUT /api/products/:id - fails without token", async () => {
    const product = await Product.create(sampleProduct);

    const res = await request(app)
      .put(`/api/products/${product._id}`)
      .send({ title: "Updated Title" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/authorization token required/i);
  });

  test("PUT /api/products/:id - succeeds with valid token", async () => {
    const product = await Product.create(sampleProduct);

    const res = await request(app)
      .put(`/api/products/${product._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Updated Title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  // ---------- DELETE /api/products/:id ----------
  test("DELETE /api/products/:id - fails without token", async () => {
    const product = await Product.create(sampleProduct);

    const res = await request(app).delete(`/api/products/${product._id}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/authorization token required/i);
  });

  test("DELETE /api/products/:id - succeeds with valid token", async () => {
    const product = await Product.create(sampleProduct);

    const res = await request(app)
      .delete(`/api/products/${product._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);

    const inDb = await Product.findById(product._id);
    expect(inDb).toBeNull();
  });

  // ---------- GET routes (public) ----------
  test("GET /api/products - is public (no token needed)", async () => {
    await Product.create(sampleProduct);

    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test("GET /api/products/:id - is public (no token needed)", async () => {
    const product = await Product.create(sampleProduct);

    const res = await request(app).get(`/api/products/${product._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(sampleProduct.title);
  });
});

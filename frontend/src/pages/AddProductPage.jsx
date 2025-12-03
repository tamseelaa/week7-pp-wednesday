import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  const [supplierName, setSupplierName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const addProduct = async (newProduct) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(newProduct),
    });

    return res.ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const product = {
      title,
      category,
      description,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      supplier: {
        name: supplierName,
        contactEmail,
        contactPhone,
      },
    };

    const success = await addProduct(product);

    if (success) navigate("/");
  };

  return (
    <div className="create">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Category:</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Price:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

        <label>Stock Quantity:</label>
        <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} />

        <label>Supplier Name:</label>
        <input value={supplierName} onChange={(e) => setSupplierName(e.target.value)} />

        <label>Supplier Email:</label>
        <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />

        <label>Supplier Phone:</label>
        <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />

        <button>Add Product</button>
      </form>
    </div>
  );
};

export default AddProductPage;

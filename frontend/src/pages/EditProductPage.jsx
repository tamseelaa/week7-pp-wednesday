import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProductPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  // Form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  const [supplierName, setSupplierName] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Unable to fetch product");
        const data = await res.json();

        // Pre-fill
        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description);
        setPrice(data.price);
        setStockQuantity(data.stockQuantity);

        setSupplierName(data.supplier.name);
        setSupplierEmail(data.supplier.contactEmail);
        setSupplierPhone(data.supplier.contactPhone);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      title,
      category,
      description,
      price,
      stockQuantity,
      supplier: {
        name: supplierName,
        contactEmail: supplierEmail,
        contactPhone: supplierPhone,
      },
    };

    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });

    if (res.ok) navigate(`/products/${id}`);
  };

  return (
    <div className="create">
      <h2>Edit Product</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <form onSubmit={submitForm}>
          <label>Product Title:</label>
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
          <input value={supplierEmail} onChange={(e) => setSupplierEmail(e.target.value)} />

          <label>Supplier Phone:</label>
          <input value={supplierPhone} onChange={(e) => setSupplierPhone(e.target.value)} />

          <button>Update Product</button>
        </form>
      )}
    </div>
  );
};

export default EditProductPage;

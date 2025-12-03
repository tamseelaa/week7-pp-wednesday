import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deleteProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      navigate("/");
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (!id || id === "undefined") {
    return <p style={{ color: "red" }}>Invalid product ID</p>;
  }

  return (
    <div className="product-preview">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{product.title}</h2>
          <p>Category: {product.category}</p>
          <p>Description: {product.description}</p>
          <p>Price: ${product.price}</p>
          <p>Stock Quantity: {product.stockQuantity}</p>
          <p>Supplier: {product.supplier?.name}</p>
          <p>Email: {product.supplier?.contactEmail}</p>
          <p>Phone: {product.supplier?.contactPhone}</p>

          {/* DELETE BUTTON */}
          <button onClick={deleteProduct}>Delete</button>

          {/* FIXED EDIT BUTTON */}
          <button onClick={() => navigate(`/products/edit/${product.id}`)}>
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default ProductPage;

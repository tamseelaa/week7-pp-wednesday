import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================
  // DELETE PRODUCT (Protected)
  // ============================
  const deleteProduct = async () => {
    if (!user) {
      alert("You must be logged in to delete a product.");
      return navigate("/login");
    }

    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      navigate("/");
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // ============================
  // FETCH PRODUCT
  // ============================
  useEffect(() => {
    if (!id) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);

        if (!res.ok) throw new Error("Failed to fetch product");

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

          {/* DELETE BUTTON (Protected) */}
          {user && <button onClick={deleteProduct}>Delete</button>}

          {/* EDIT BUTTON (Protected) */}
          {user && (
            <button onClick={() => navigate(`/products/edit/${product.id}`)}>
              Edit
            </button>
          )}

          {!user && (
            <p style={{ color: "red" }}>
              Login to edit or delete products.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPage;

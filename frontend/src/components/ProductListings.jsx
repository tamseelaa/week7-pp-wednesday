import { Link } from "react-router-dom";

const ProductListings = ({ products }) => {
  if (!Array.isArray(products)) return null;

  return (
    <div className="product-list">
      {products.map((product, index) => (
        <div className="product-preview" key={product.id || index}>
          <Link to={`/products/${product.id}`}>
            <h2>{product.title}</h2>
          </Link>

          <p>Category: {product.category}</p>
          <p>Description: {product.description}</p>
          <p>Price: ${product.price}</p>
          <p>Stock Quantity: {product.stockQuantity}</p>

          {product.supplier && (
            <p>Supplier: {product.supplier.name}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductListings;

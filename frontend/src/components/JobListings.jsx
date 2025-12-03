import { Link } from "react-router-dom";

const ProductListings = ({ products }) => {
  if (!Array.isArray(products)) return null;

  return (
    <div className="product-list">
      {products.map((product) => (
        <div className="product-preview" key={product._id}>
          <Link to={`/products/${product._id}`}>
            <h2>{product.title}</h2>
          </Link>

          <p>Type: {product.type}</p>

          {product.company && (
            <p>Company: {product.company.name}</p>
          )}
        </div>
      ))}
    </div>
  );
};
export default ProductListings;
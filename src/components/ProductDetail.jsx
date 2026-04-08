import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <div className="container status-message">
        Product not found.
        <button className="button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    navigate("/cart");
  };

  return (
    <section className="product-detail container">
      <div className="detail-card">
        <img src={product.image} alt={product.title} />
        <div className="detail-copy">
          <h2>{product.title}</h2>
          <p className="category">{product.category}</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <div className="quantity-control">
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
            />
          </div>
          <button className="button primary" onClick={handleAddToCart}>
            Add to cart
          </button>
          <button className="button secondary" onClick={() => navigate(-1)}>
            Back to products
          </button>
        </div>
      </div>
    </section>
  );
}

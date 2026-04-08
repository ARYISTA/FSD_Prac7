import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartItem({ item }) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-image-wrap">
        <img src={item.image} alt={item.title} className="cart-item-image" />
      </div>
      <div className="cart-item-info">
        <Link to={`/product/${item.id}`} className="cart-item-title">
          {item.title}
        </Link>
        <span className="cart-item-category">{item.category}</span>
        <span className="cart-item-unit-price">
          ${item.price.toFixed(2)} each
        </span>
      </div>
      <div className="cart-item-controls">
        <div className="qty-selector small">
          <button
            className="qty-btn"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
          >
            −
          </button>
          <span className="qty-value">{item.quantity}</span>
          <button
            className="qty-btn"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
        <span className="cart-item-subtotal">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        <button
          className="remove-btn"
          onClick={() => removeItem(item.id)}
          title="Remove"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function Cart() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="page-title">Your Cart</h1>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛍</div>
          <h2>Your cart is empty</h2>
          <p>Discover our curated collection and add something you love.</p>
          <Link to="/" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="page-title">Your Cart</h1>
        <span className="cart-item-count">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items-panel">
          <div className="cart-items-list">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="cart-actions-bar">
            <Link to="/" className="btn btn-ghost">
              ← Continue Shopping
            </Link>
            <button className="btn btn-outline btn-danger" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="cart-summary-panel">
          <div className="summary-card">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? "free-tag" : ""}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping === 0 && (
                <p className="free-shipping-note">
                  ✓ You qualify for free shipping!
                </p>
              )}
              {shipping > 0 && (
                <p className="free-shipping-note muted">
                  Add ${(50 - totalPrice).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total-row">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout →
            </button>
            <div className="secure-note">
              <span>🔒</span> Secure & encrypted checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
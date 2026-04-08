import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">◈</span>
        <span className="brand-name">LUXE</span>
        <span className="brand-sub">STORE</span>
      </Link>

      <div className="navbar-links">
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          Shop
        </Link>
        <Link
          to="/cart"
          className={`nav-link cart-link ${
            location.pathname === "/cart" ? "active" : ""
          }`}
        >
          <span className="cart-icon">🛍</span>
          <span>Cart</span>
          {totalItems > 0 && (
            <span className="cart-badge">{totalItems}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}
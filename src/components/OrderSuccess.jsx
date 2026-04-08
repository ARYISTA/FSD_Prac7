import React from "react";
import { Link } from "react-router-dom";

export default function OrderSuccess() {
  const orderId = `LX-${Math.floor(Math.random() * 900000 + 100000)}`;

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-animation">
          <div className="success-ring" />
          <div className="success-check">✓</div>
        </div>
        <h1 className="success-title">Order Placed!</h1>
        <p className="success-subtitle">
          Thank you for your purchase. We'll send a confirmation to your email
          shortly.
        </p>
        <div className="success-order-id">
          Order ID: <strong>{orderId}</strong>
        </div>
        <div className="success-actions">
          <Link to="/" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
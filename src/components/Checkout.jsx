import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api } from "../context/ProductContext";

const STEPS = ["Shipping", "Payment", "Review"];

function StepIndicator({ current }) {
  return (
    <div className="step-indicator">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div
            className={`step ${i < current ? "done" : ""} ${
              i === current ? "active" : ""
            }`}
          >
            <div className="step-circle">
              {i < current ? "✓" : i + 1}
            </div>
            <span className="step-label">{step}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`step-line ${i < current ? "done" : ""}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const [payment, setPayment] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shippingCost + tax;

  const validate = () => {
    const errs = {};
    if (step === 0) {
      if (!shipping.firstName) errs.firstName = "Required";
      if (!shipping.lastName) errs.lastName = "Required";
      if (!shipping.email || !/\S+@\S+\.\S+/.test(shipping.email))
        errs.email = "Valid email required";
      if (!shipping.address) errs.address = "Required";
      if (!shipping.city) errs.city = "Required";
      if (!shipping.zip) errs.zip = "Required";
    }
    if (step === 1) {
      if (!payment.cardName) errs.cardName = "Required";
      if (!payment.cardNumber || payment.cardNumber.replace(/\s/g, "").length < 16)
        errs.cardNumber = "Valid card number required";
      if (!payment.expiry) errs.expiry = "Required";
      if (!payment.cvv || payment.cvv.length < 3) errs.cvv = "Valid CVV required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // POST order to API
      await api.post("/carts", {
        userId: 1,
        date: new Date().toISOString().split("T")[0],
        products: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });
      clearCart();
      navigate("/order-success");
    } catch (err) {
      console.error("Order failed:", err);
      // Navigate anyway for demo
      clearCart();
      navigate("/order-success");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCard = (val) =>
    val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-state">
          <div className="empty-icon">◎</div>
          <h2>Nothing to checkout</h2>
          <Link to="/" className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="page-title">Checkout</h1>
      <StepIndicator current={step} />

      <div className="checkout-layout">
        {/* Form */}
        <div className="checkout-form-panel">
          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="form-section">
              <h2 className="form-section-title">Shipping Information</h2>
              <div className="form-grid">
                {[
                  { key: "firstName", label: "First Name", half: true },
                  { key: "lastName", label: "Last Name", half: true },
                  { key: "email", label: "Email Address", type: "email" },
                  { key: "phone", label: "Phone", type: "tel" },
                  { key: "address", label: "Street Address" },
                  { key: "city", label: "City", half: true },
                  { key: "state", label: "State", half: true },
                  { key: "zip", label: "ZIP Code", half: true },
                ].map(({ key, label, type = "text", half }) => (
                  <div
                    key={key}
                    className={`form-group ${half ? "half" : ""}`}
                  >
                    <label className="form-label">{label}</label>
                    <input
                      type={type}
                      className={`form-input ${errors[key] ? "error" : ""}`}
                      value={shipping[key]}
                      onChange={(e) =>
                        setShipping({ ...shipping, [key]: e.target.value })
                      }
                    />
                    {errors[key] && (
                      <span className="form-error">{errors[key]}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="form-section">
              <h2 className="form-section-title">Payment Details</h2>
              <div className="card-preview">
                <div className="card-chip">▣</div>
                <div className="card-number-display">
                  {payment.cardNumber || "•••• •••• •••• ••••"}
                </div>
                <div className="card-bottom">
                  <span>{payment.cardName || "CARDHOLDER NAME"}</span>
                  <span>{payment.expiry || "MM/YY"}</span>
                </div>
              </div>
              <div className="form-grid">
                {[
                  { key: "cardName", label: "Name on Card" },
                  { key: "cardNumber", label: "Card Number", format: formatCard },
                  { key: "expiry", label: "Expiry (MM/YY)", half: true, placeholder: "MM/YY" },
                  { key: "cvv", label: "CVV", half: true, type: "password" },
                ].map(({ key, label, type = "text", half, format, placeholder }) => (
                  <div key={key} className={`form-group ${half ? "half" : ""}`}>
                    <label className="form-label">{label}</label>
                    <input
                      type={type}
                      className={`form-input ${errors[key] ? "error" : ""}`}
                      value={payment[key]}
                      placeholder={placeholder}
                      onChange={(e) =>
                        setPayment({
                          ...payment,
                          [key]: format
                            ? format(e.target.value)
                            : e.target.value,
                        })
                      }
                    />
                    {errors[key] && (
                      <span className="form-error">{errors[key]}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="form-section">
              <h2 className="form-section-title">Review Your Order</h2>
              <div className="review-section">
                <h3 className="review-sub">Shipping To</h3>
                <p>
                  {shipping.firstName} {shipping.lastName}
                </p>
                <p>{shipping.address}</p>
                <p>
                  {shipping.city}, {shipping.state} {shipping.zip}
                </p>
                <p>{shipping.email}</p>
              </div>
              <div className="review-section">
                <h3 className="review-sub">Items ({items.length})</h3>
                {items.map((item) => (
                  <div key={item.id} className="review-item">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="review-item-img"
                    />
                    <div className="review-item-info">
                      <span className="review-item-title">{item.title}</span>
                      <span className="review-item-qty">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="review-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="form-nav">
            {step > 0 && (
              <button
                className="btn btn-outline"
                onClick={() => setStep((s) => s - 1)}
              >
                ← Back
              </button>
            )}
            {step < 2 ? (
              <button className="btn btn-primary btn-lg" onClick={handleNext}>
                Continue →
              </button>
            ) : (
              <button
                className={`btn btn-primary btn-lg ${
                  submitting ? "loading" : ""
                }`}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Placing Order…" : "Place Order →"}
              </button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary-panel">
          <div className="summary-card">
            <h2 className="summary-title">Summary</h2>
            <div className="checkout-item-list">
              {items.map((item) => (
                <div key={item.id} className="checkout-mini-item">
                  <span className="checkout-mini-qty">{item.quantity}×</span>
                  <span className="checkout-mini-name">{item.title.slice(0, 28)}…</span>
                  <span className="checkout-mini-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? "free-tag" : ""}>
                  {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total-row">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
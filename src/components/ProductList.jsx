import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";

function StarRating({ rate, count }) {
  const stars = Math.round(rate);
  return (
    <div className="star-rating">
      <span className="stars">
        {"★".repeat(stars)}{"☆".repeat(5 - stars)}
      </span>
      <span className="review-count">({count})</span>
    </div>
  );
}

function ProductCard({ product }) {
  const { addItem } = useCart();
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="card-image-link">
        <div className="card-image-wrap">
          <img src={product.image} alt={product.title} className="card-image" />
          <div className="card-overlay">
            <span className="overlay-text">View Details</span>
          </div>
        </div>
      </Link>
      <div className="card-body">
        <span className="card-category">{product.category}</span>
        <Link to={`/product/${product.id}`} className="card-title-link">
          <h3 className="card-title">{product.title}</h3>
        </Link>
        <StarRating rate={product.rating?.rate} count={product.rating?.count} />
        <div className="card-footer">
          <span className="card-price">${product.price.toFixed(2)}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => addItem(product)}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductList() {
  const {
    filteredProducts,
    categories,
    activeCategory,
    searchQuery,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    setCategory,
    setSearch,
  } = useProducts();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts(activeCategory === "all" ? null : activeCategory);
  }, [fetchProducts, activeCategory]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
  };

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠</div>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => fetchProducts()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="product-list-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">New Season Arrivals</p>
          <h1 className="hero-title">
            Curated <em>Essentials</em>
          </h1>
          <p className="hero-sub">
            Discover products crafted for the discerning taste.
          </p>
        </div>
        <div className="hero-decoration">
          <div className="deco-ring ring-1" />
          <div className="deco-ring ring-2" />
          <div className="deco-ring ring-3" />
        </div>
      </section>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-pills">
          <button
            className={`pill ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => handleCategoryChange("all")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="loading-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-line short" />
              <div className="skeleton-line" />
              <div className="skeleton-line medium" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="results-count">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">◎</div>
              <h3>No products found</h3>
              <p>Try a different search or category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
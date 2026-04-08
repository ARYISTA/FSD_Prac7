import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import axios from "axios";

const ProductContext = createContext(null);

const BASE_URL = "https://fakestoreapi.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token here if needed: config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const productReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_PRODUCTS_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_PRODUCT_SUCCESS":
      return { ...state, loading: false, selectedProduct: action.payload };
    case "FETCH_CATEGORIES_SUCCESS":
      return { ...state, categories: action.payload };
    case "SET_CATEGORY":
      return { ...state, activeCategory: action.payload };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  products: [],
  selectedProduct: null,
  categories: [],
  activeCategory: "all",
  searchQuery: "",
  loading: false,
  error: null,
};

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const fetchProducts = useCallback(async (category = null) => {
    dispatch({ type: "FETCH_START" });
    try {
      const url =
        category && category !== "all"
          ? `/products/category/${category}`
          : "/products";
      const { data } = await api.get(url);
      dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    dispatch({ type: "FETCH_START" });
    try {
      const { data } = await api.get(`/products/${id}`);
      dispatch({ type: "FETCH_PRODUCT_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await api.get("/products/categories");
      dispatch({ type: "FETCH_CATEGORIES_SUCCESS", payload: data });
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  const setCategory = useCallback((cat) => {
    dispatch({ type: "SET_CATEGORY", payload: cat });
  }, []);

  const setSearch = useCallback((q) => {
    dispatch({ type: "SET_SEARCH", payload: q });
  }, []);

  const filteredProducts = state.products.filter((p) =>
    p.title.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <ProductContext.Provider
      value={{
        ...state,
        filteredProducts,
        fetchProducts,
        fetchProductById,
        fetchCategories,
        setCategory,
        setSearch,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}

export { api };
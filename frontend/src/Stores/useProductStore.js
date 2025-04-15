import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios.js";

const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      // Determine if we're dealing with FormData or a regular object
      const isFormData = productData instanceof FormData;
      console.log(
        "Creating product with:",
        isFormData ? "FormData" : "JSON data"
      );

      const config = {
        headers: {
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json",
        },
      };

      const res = await axios.post("/products", productData, config);

      set((state) => ({
        products: [...state.products, res.data],
        loading: false,
      }));

      toast.success("Product created successfully!");
      return res.data;
    } catch (error) {
      console.error("Error creating product:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Product creation failed");
      set({ loading: false });
      throw error;
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response?.data?.message || "Couldn't fetch products");
    }
  },
  fetchRecommendations: async () => {
    set({ loading: true });
    try {
      console.log("fetching recommendations");
      const res = await axios.get("/products/get-recommendations");
      console.log("received response:", res);
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to Fetch Products", loading: false });
      toast.error("Error in Recommendations:", error);
    }
  },
  fetchProductByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      console.log(`API response for ${category}:`, response.data);

      // Handle different response structures
      const products =
        response.data.products ||
        (Array.isArray(response.data) ? response.data : []);

      set({ products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch Products", loading: false });
      toast.error(error.response?.data?.message || "Failed to Fetch Products");
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      // Use DELETE method here
      await axios.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
        loading: false,
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to Delete Product");
    }
  },

  toggleFeaturedProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/products/${id}`);
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: res.data.isFeatured }
            : product
        ),
        loading: false,
      }));
      toast.success("Product status updated");
    } catch (error) {
      set({ error: "Failed to update product", loading: false });
      toast.error(error.response?.data?.message || "Couldn't update product");
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products/featured");
      // Extract the products array from the response
      const productArray = res.data.products || [];
      set({ products: productArray, loading: false });
      console.log("Products array extracted:", productArray);
    } catch (error) {
      set({ error: "Failed to Fetch Products", loading: false });
      console.log("Error fetching products:", error);
      toast.error("Failed to Fetch Product");
    }
  },
}));

export default useProductStore;

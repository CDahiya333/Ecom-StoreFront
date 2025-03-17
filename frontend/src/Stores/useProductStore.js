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

      // Add debug logging
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

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.post(`/products/${id}`);
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
}));

export default useProductStore;

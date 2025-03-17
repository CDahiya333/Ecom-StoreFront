import { create } from "zustand";
import axios from "../lib/axios.js"; // Updated import path to match your structure
import toast from "react-hot-toast";

const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart"); // Use axios instead of api
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      console.error("Get cart error:", error);
      set({ cart: [] });
      toast.error(
        error?.response?.data?.message || "Failed to fetch cart items"
      );
    }
  },
  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id }); // Use axios instead of api
      toast.success("Added to Cart");
      set((state) => {
        const existingItem = state.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? state.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...state.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      console.error("Cart error:", error);
      toast.error(error?.response?.data?.message || "Failed to Add to Cart");
    }
  },
  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }
    set({ subtotal, total });
  },
}));

export default useCartStore;

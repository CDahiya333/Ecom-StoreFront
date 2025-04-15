import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useCartStore = create(
  persist((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,
    isLoading: false,

    // Getting all the existing Coupons from the BACKEND
    getMyCoupon: async () => {
      try {
        const response = await axios.get("/coupons");
        set({ coupon: response.data });
      } catch (error) {
        console.error("Error fetching coupon:", error);
      }
    },

    applyCoupon: async (code) => {
      try {
        const response = await axios.post("/coupons/validate", { code });
        set({ coupon: response.data, isCouponApplied: true });
        get().calculateTotals();
        toast.success("Coupon applied successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to apply coupon");
      }
    },

    removeCoupon: () => {
      set({ coupon: null, isCouponApplied: false });
      get().calculateTotals();
      toast.success("Coupon removed");
    },

    getCartItems: async () => {
      set({ isLoading: true });
      try {
        console.log("Fetching cart items...");
        const res = await axios.get("/cart");
        console.log("Cart response:", res.data);

        // Ensure we always get an array
        const cartItems = Array.isArray(res.data) ? res.data : [];

        set({ cart: cartItems, isLoading: false });
        get().calculateTotals();
      } catch (error) {
        console.error("Error getting cart items:", error);
        set({ cart: [], isLoading: false });
        toast.error(
          error.response?.data?.message || "Failed to load cart items"
        );
      }
    },

    clearCart: async () => {
      try {
        await axios.delete("/cart");
        set({ cart: [], coupon: null, total: 0, subtotal: 0 });
        toast.success("Cart cleared");
      } catch (error) {
        console.log("Error Message in Clear Cart:", error.message);
        toast.error("Failed to clear cart");
      }
    },

    // BACKEND expects and returns in Array format consisting object { _id: String, quantity: Number }
    addToCart: async (product) => {
      try {
        console.log(`Adding product to cart: ${product._id}`);
        const response = await axios.post("/cart", {
          productId: product._id,
        });

        if (Array.isArray(response.data)) {
          set({ cart: response.data });
          get().calculateTotals();
        } else {
          throw new Error("Invalid server response format");
        }
        toast.success("Added to cart");
      } catch (error) {
        console.error("Couldn't add to cart:", error);

        // Local Optimistic update
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
            : [...state.cart, { ...product, _id: product._id, quantity: 1 }];
          return { cart: newCart };
        });
        get().calculateTotals();

        toast.error(
          error.response?.data?.message || "Added to Cart(optimistic)"
        );
      }
    },

    removeFromCart: async (productId) => {
      set((state) => {
        const updatedCart = state.cart.filter((item) => item._id !== productId);
        return { cart: updatedCart };
      });
      get().calculateTotals();

      // Sync with Server
      try {
        console.log(`Removing product from Cart: ${productId}`);
        const response = await axios.delete("/cart", {
          data: { productId },
          headers: { "Content-Type": "application/json" },
        });
        console.log("Response from server:", response.data);

        // Updating the Server
        if (Array.isArray(response.data)) {
          set({ cart: response.data });
          get().calculateTotals();
        }
        toast.success("Removed from cart");
      } catch (error) {
        console.log("Error removing from Cart:", error);
        get().getCartItems();
        toast.error("Failed to remove from cart");
      }
    },
    updateQuantity: async (productId, quantity) => {
      try {
        console.log(`Updating quantity for ${productId} to ${quantity}`);

        if (quantity <= 0) {
          return get().removeFromCart(productId);
        }
        //Optimistic update first
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item._id === productId
              ? { ...item, quantity: Number(quantity) }
              : item
          );
          return { cart: updatedCart };
        });
        get().calculateTotals();

        // Sync with Server
        const response = await axios.put(`/cart/${productId}`, { quantity });

        if (Array.isArray(response.data)) {
          set({ cart: response.data });
          get().calculateTotals();
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        get().getCartItems();
        toast.error("Failed to update quantity");
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
  }))
);

export default useCartStore;

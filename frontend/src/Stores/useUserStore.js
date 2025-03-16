import {create} from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

const useUserStore = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    try {
      set({ loading: true });
      if (password !== confirmPassword) {
        set({ loading: false });
        return toast.error("Passwords do not match");
      }
      const response = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      console.log(response);
      set({ user: response.data.user, loading: false });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      set({ loading: false });
    }
  },
}));

export default useUserStore;

import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

const useUserStore = create((set, get) => ({
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
      const res = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      console.log(res);
      set({ user: res.data, loading: false });
      toast.success("SignUp Successful");
    } catch (error) {
      // Use error.response instead of error.res
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Error Signing Up";
      toast.error(message);
      set({ loading: false });
    }
  },
  login: async ({ email, password }) => {
    try {
      set({ loading: true });
      const res = await axios.post("/auth/login", {
        email,
        password,
      });
      console.log(res);
      set({ user: res.data, loading: false });
      toast.success("Logged In Successfully");
    } catch (error) {
      // Use error.response instead of error.res
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Login failed";
      toast.error(message);
      set({ loading: false });
    }
  },
  checkAuth: async () => {
    try {
      set({ checkingAuth: true });
      const res = await axios.get("/auth/getProfile");
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Try Loging In Again";
      toast.error(message);
      set({ checkingAuth: false, user: null });
    }
  },
  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
      toast.success("Logged Out Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },
  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkAuth: false });
      throw error;
    }
  },
}));
// Set up axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh if it's a 401 error and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If there's already a refresh in progress, wait for it
        if (refreshPromise) {
          await refreshPromise;
        } else {
          // Start a new refresh
          refreshPromise = useUserStore.getState().refreshToken();
          await refreshPromise;
          refreshPromise = null;
        }

        // After successful refresh, retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out
        console.error("Token refresh failed:", refreshError);
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);
export default useUserStore;

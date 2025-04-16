import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import Navbar from "./components/Navbar.jsx";
import ChatUI from "./components/ChatUI.jsx";
import { Toaster } from "react-hot-toast";
import useUserStore from "./Stores/useUserStore.js";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import useCartStore from "./Stores/useCartStore.js";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage.jsx";
import PurchaseCancelPage from "./pages/PurchaseCancelPage.jsx";
function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      getCartItems().catch(console.error);
    }
  }, [user, getCartItems]);

  if (checkingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white relative overflow-hidden">
      {/* <div>Background Styling</div> */}
      <div>
        <Navbar />
        <ChatUI />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/signup"
              element={user ? <HomePage /> : <SignUpPage />}
            />
            <Route
              path="/login"
              element={user ? <HomePage /> : <LoginPage />}
            />
            <Route
              path="/dashboard"
              element={user?.role === "admin" ? <AdminPage /> : <HomePage />}
            />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/cart" element={user ? <CartPage /> : <LoginPage />} />
            <Route
              path="/purchase-success"
              element={user ? <PurchaseSuccessPage /> : <LoginPage />}
            />
            <Route
              path="/purchase-cancelled"
              element={user ? <PurchaseCancelPage /> : <LoginPage />}
            />
          </Routes>
        </ErrorBoundary>
      </div>
      <Toaster />
    </div>
  );
}

export default App;

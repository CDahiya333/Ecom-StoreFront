import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import Navbar from "./components/Navbar.jsx";
import ChatUI from "./components/ChatUI.jsx";
import { Toaster } from "react-hot-toast";
import useUserStore from "./Stores/useUserStore.js";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white relative overflow-hidden">
      {/* <div>Background Styling</div> */}
      <div>
        <Navbar />
        <ChatUI />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={user ? <HomePage /> : <SignUpPage />}
          />
          <Route path="/login" element={user ? <HomePage /> : <LoginPage />} />
          <Route
            path="/dashboard"
            element={user?.role === "admin" ? <AdminPage /> : <LoginPage />}
          />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;

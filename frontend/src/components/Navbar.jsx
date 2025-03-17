import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import useUserStore from "../Stores/useUserStore.js";
import { useEffect } from "react";
import useCartStore from "../Stores/useCartStore.js";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const isAdmin = user?.role === "admin";

  // Add smooth scroll effect when the page loads
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-zinc-900 bg-opacity-95 backdrop-blur-md z-40 transition-all duration-500 border-b border-amber-900">
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Montserrat:wght@300;400;500&display=swap");

        header.scrolled {
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        }

        .nav-link {
          position: relative;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: #d4a574;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .logo-text {
          font-family: "Playfair Display", serif;
          letter-spacing: 1px;
        }

        .nav-item {
          font-family: "Montserrat", sans-serif;
          letter-spacing: 0.5px;
          font-weight: 300;
        }
      `}</style>

      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="w-full sm:w-auto text-2xl font-bold text-amber-100 hover:text-amber-200 mb-4 sm:mb-0 transition-colors duration-300 logo-text flex items-center"
          >
            <span className="text-amber-500 mr-1">M</span>AISON ÉLÉGANCE
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-6 w-full sm:w-auto justify-between sm:justify-end nav-item">
            <Link
              to="/"
              className="text-amber-100 hover:text-amber-300 transition-colors duration-300 nav-link"
            >
              Home
            </Link>
            <Link
              to="/collections"
              className="text-amber-100 hover:text-amber-300 transition-colors duration-300 nav-link"
            >
              Collections
            </Link>
            {user && (
              <Link
                to="/cart"
                className="flex items-center gap-2 group transition-all duration-300"
              >
                <div className="relative">
                  <ShoppingCart
                    className="text-amber-100 group-hover:text-amber-300 transition-colors duration-300"
                    size={20}
                  />
                  {/* Cart Badge */}
                  <span className="absolute -top-3 -right-3 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-amber-900 bg-amber-400 rounded-full shadow-md">
                    {cart.length}
                  </span>
                </div>
                <span className="hidden sm:inline text-amber-100 group-hover:text-amber-300 transition-colors duration-300">
                  Cart
                </span>
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/dashboard"
                className="bg-amber-900 hover:bg-amber-800 text-amber-100 px-5 py-2 rounded-none border border-amber-700 hover:border-amber-500 font-medium transition-all duration-300 flex items-center"
              >
                <Lock className="inline-block mr-2" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            {user ? (
              <button
                className="flex items-center bg-amber-900 hover:bg-amber-800 text-amber-100 px-5 py-2 rounded-none border border-amber-700 hover:border-amber-500 transition-all duration-300"
                onClick={logout}
              >
                <LogOut size={16} className="mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-amber-900 hover:bg-amber-800 text-amber-100 px-5 py-2 rounded-none border border-amber-700 hover:border-amber-500 font-medium transition-all duration-300 flex items-center"
                >
                  <UserPlus className="inline-block mr-2" size={16} />
                  <span className="hidden sm:inline">Register</span>
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent hover:bg-amber-900/30 text-amber-300 px-5 py-2 rounded-none border border-amber-700 hover:border-amber-500 font-medium transition-all duration-300 flex items-center"
                >
                  <LogIn className="inline-block mr-2" size={16} />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

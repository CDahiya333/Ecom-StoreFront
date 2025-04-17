import {
  ShoppingCart,
  UserPlus,
  LogIn,
  LogOut,
  Lock,
  Menu,
  X,
  Home,
  ShoppingBag,
  BookOpen,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useUserStore from "../Stores/useUserStore.js";
import { useEffect, useState, useRef } from "react";
import useCartStore from "../Stores/useCartStore.js";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const isAdmin = user?.role === "admin";
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Handle scroll behavior and smooth scrolling
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [location]);

  // Add scroll effect on header
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        mobileMenuOpen
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

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

        /* Improved mobile menu styling */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          height: 100vh;
          background-color: rgba(20, 17, 15, 0.98);
          backdrop-filter: blur(8px);
          z-index: 50;
          display: flex;
          flex-direction: column;
          transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
          overflow-y: auto;
        }

        @media (min-width: 640px) {
          .mobile-menu {
            width: 320px;
          }
        }

        .mobile-menu.closed {
          transform: translateX(100%);
        }

        .mobile-menu.open {
          transform: translateX(0);
        }

        .mobile-menu-link {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(217, 119, 6, 0.1);
          transition: all 0.3s ease;
        }

        .mobile-menu-link:hover,
        .mobile-menu-link:focus {
          background-color: rgba(217, 119, 6, 0.1);
          padding-left: 28px;
        }

        .mobile-menu-link svg {
          margin-right: 16px;
          opacity: 0.8;
        }

        .mobile-menu-header {
          padding: 20px;
          border-bottom: 1px solid rgba(217, 119, 6, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mobile-menu-footer {
          margin-top: auto;
          padding: 24px;
          border-top: 1px solid rgba(217, 119, 6, 0.2);
        }

        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 49;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .menu-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }

        .action-button {
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: center;
          padding: 12px;
          margin: 8px 0;
          transition: all 0.3s ease;
        }
      `}</style>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl body-font text-amber-100 hover:text-amber-200 transition-colors duration-300 logo-text flex items-center"
          >
            <span className="text-amber-500 mr-1">M</span>
            AISON ÉLÉGANCE
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-amber-100 hover:text-amber-300 transition-colors duration-300 z-50 p-2 border border-amber-900/50 rounded-sm hover:border-amber-700/70 hover:bg-amber-900/20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={22} />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 justify-end nav-item">
            <Link
              to="/#home"
              className="text-amber-100 hover:text-amber-300 transition-colors duration-300 nav-link"
            >
              Home
            </Link>
            <Link
              to="/#featured"
              className="text-amber-100 hover:text-amber-300 transition-colors duration-300 nav-link"
            >
              Collections
            </Link>
            <Link
              to="/#blog"
              className="text-amber-100 hover:text-amber-300 transition-colors duration-300 nav-link"
            >
              Blog
            </Link>
            {user && (
              <Link
                to="/cart"
                className="flex items-center gap-2 group transition-all duration-300"
                aria-label="Shopping cart"
              >
                <div className="relative">
                  <ShoppingCart
                    className="text-amber-100 group-hover:text-amber-300 transition-colors duration-300"
                    size={20}
                  />
                  {cart.length > 0 && (
                    <span className="absolute -top-3 -right-3 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-amber-900 bg-amber-400 rounded-full shadow-md">
                      {cart.length}
                    </span>
                  )}
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

        {/* Overlay background for mobile menu */}
        <div
          className={`menu-overlay ${mobileMenuOpen ? "active" : ""}`}
          onClick={closeMenu}
        />

        {/* Improved Mobile Menu - Slides from right */}
        <div
          ref={menuRef}
          className={`mobile-menu ${mobileMenuOpen ? "open" : "closed"}`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="mobile-menu-header">
            <div className="text-xl logo-text text-amber-100">
              <span className="text-amber-500 mr-1">M</span>AISON ÉLÉGANCE
            </div>
            <button
              className="text-amber-100 hover:text-amber-300 transition-colors duration-300 p-2 border border-amber-700/50 rounded-sm hover:border-amber-600 hover:bg-amber-900/30"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col nav-item">
            <Link to="/#home" className="mobile-menu-link" onClick={closeMenu}>
              <Home size={20} className="text-amber-300" />
              <span className="text-amber-100">Home</span>
            </Link>
            <Link
              to="/#featured"
              className="mobile-menu-link"
              onClick={closeMenu}
            >
              <ShoppingBag size={20} className="text-amber-300" />
              <span className="text-amber-100">Collections</span>
            </Link>
            <Link to="/#blog" className="mobile-menu-link" onClick={closeMenu}>
              <BookOpen size={20} className="text-amber-300" />
              <span className="text-amber-100">Blog</span>
            </Link>
            {user && (
              <Link to="/cart" className="mobile-menu-link" onClick={closeMenu}>
                <div className="relative">
                  <ShoppingCart size={20} className="text-amber-300" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-amber-900 bg-amber-400 rounded-full shadow-md">
                      {cart.length}
                    </span>
                  )}
                </div>
                <span className="text-amber-100 ml-4">Cart</span>
              </Link>
            )}
          </nav>

          <div className="mobile-menu-footer">
            {isAdmin && (
              <Link
                to="/dashboard"
                className="action-button bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-none border border-amber-700 hover:border-amber-500 font-medium mb-3"
                onClick={closeMenu}
              >
                <Lock className="mr-2" size={18} />
                Dashboard
              </Link>
            )}
            {user ? (
              <button
                className="action-button bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-none border border-amber-700 hover:border-amber-500"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="action-button bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-none border border-amber-700 hover:border-amber-500 font-medium mb-3"
                  onClick={closeMenu}
                >
                  <LogIn className="mr-2" size={16} />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="action-button bg-transparent hover:bg-amber-900/30 text-amber-300 rounded-none border border-amber-700 hover:border-amber-500 font-medium"
                  onClick={closeMenu}
                >
                  <UserPlus className="mr-2" size={16} />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

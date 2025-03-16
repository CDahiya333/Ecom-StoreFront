import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = true;
  const isAdmin = true;

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 border-b border-emerald-500">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="w-full sm:w-auto text-2xl font-bold text-white hover:text-gray-300 mb-2 sm:mb-0"
          >
            E-Commerce
          </Link>
          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <Link
              to="/"
              className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
            >
              Home
            </Link>

            {user && (
              <Link to="/cart" className="flex items-center gap-1">
                <div className="relative ">
                  <ShoppingCart
                    className="group-hover:text-emerald-400"
                    size={20}
                  />
                  {/* Cart Badge */}
                  <span className="absolute -top-1 -right-2 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    3
                  </span>
                </div>
                <span className="hidden sm:inline">Cart</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/dashboard"
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
              >
                <Lock className="inline-block mr-1" size={20} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button className="flex items-center bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out">
                <LogOut size={18} className="mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
                >
                  <UserPlus className="inline-block mr-1" size={20} />
                  <span className="hidden sm:inline">Signup</span>
                </Link>
                <Link
                  to="/login"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
                >
                  <LogIn className="inline-block mr-1" size={20} />
                  <span className="hidden sm:inline">Login</span>
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

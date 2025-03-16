import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import useUserStore from "../Stores/useUserStore.js";
import "../index.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-zinc-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h2 className="mt-6 text-center text-3xl font-bold text-zinc-800 heading-font">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600 body-font">
          Sign in to access your account
        </p>
      </motion.div>
      
      {/* Animated Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-lg border border-amber-200/30 sm:rounded-none sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6 body-font">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700"
              >
                Email Address
              </label>
              <div className="mt-1 relative rounded-none shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="appearance-none text-zinc-800 block w-full px-3 py-3 border-b border-zinc-300 rounded-none placeholder-zinc-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm bg-white/80"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-amber-800/50" />
                </div>
              </div>
            </div>
            
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-none shadow-sm">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                  className="appearance-none text-zinc-800 block w-full px-3 py-3 border-b border-zinc-300 rounded-none placeholder-zinc-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm bg-white/80"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-amber-800/50" />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-xs text-amber-800 hover:text-amber-600 transition-colors duration-300">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-center items-center py-3 px-4 border border-amber-800 rounded-none text-sm font-medium text-white bg-amber-900 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Signing you in
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2" size={20} />
                    Sign In
                  </>
                )}
              </motion.button>
            </div>

            {/* Redirect to Signup */}
            <div className="mt-4 flex justify-center">
              <p className="text-sm text-zinc-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-amber-800 hover:text-amber-600 transition-colors duration-300"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
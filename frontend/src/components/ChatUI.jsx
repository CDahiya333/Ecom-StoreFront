import React, { useState, useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare } from "lucide-react";
import formatMessage from "../lib/formatMessage";

const ChatUI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);

    // Add welcome message if this is the first time opening the chat
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          type: "ai",
          content:
            "Welcome to Maison Elegance. How may I assist you with your furniture and decor needs today?",
        },
      ]);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Add user message to chat
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);

    // Show loading state
    setIsLoading(true);

    try {
      // Send request to our backend API
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add AI response to chat
      setMessages((prev) => [...prev, { type: "ai", content: data.response }]);
    } catch (error) {
      console.error("Error getting response:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content:
            "Trouble Connecting to our remote assistant. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Animation variants
  const chatButtonVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  const chatContainerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed z-50 bottom-8 right-8 w-14 h-14 rounded-full bg-amber-800 text-white shadow-lg flex items-center justify-center"
        onClick={toggleChat}
        variants={chatButtonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        aria-label="Chat with Maison Elegance Assistant"
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed z-50 bottom-24 right-8 w-1/2 max-w-[500px] h-[500px] bg-amber-50 rounded-xl shadow-2xl flex flex-col overflow-hidden border border-amber-200"
            variants={chatContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Chat Header */}
            <div className="px-4 py-3 bg-amber-800 text-white flex justify-between items-center">
              <h3 className="font-semibold">Maison Elegance Assistant</h3>
              <button
                onClick={toggleChat}
                className="p-1 hover:bg-amber-700 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-[url('/wood-texture-light.jpg')] bg-opacity-10">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-amber-800 opacity-70">
                  <MessageSquare size={40} className="mb-3 opacity-50" />
                  <p className="text-center font-light">
                    Welcome to Maison Elegance. How may I assist you with your
                    furniture and decor needs today?
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`mb-4 ${
                      message.type === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }`}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                        message.type === "user"
                          ? "bg-amber-800 text-white rounded-tr-none"
                          : "bg-white text-amber-900 rounded-tl-none border border-amber-100"
                      }`}
                    >
                      {message.type === "user" ? (
                        <p>{message.content}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          {formatMessage(message.content)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <motion.div
                  className="flex justify-start mb-4"
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="bg-white p-4 rounded-lg rounded-tl-none shadow-sm border border-amber-100">
                    <div className="flex space-x-2">
                      <span
                        className="w-2 h-2 bg-amber-800 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-amber-800 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-amber-800 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-amber-100 border-t border-amber-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about our furniture..."
                  className="flex-1 px-4 py-2 rounded-full bg-white border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-900"
                />
                <motion.button
                  onClick={handleSendMessage}
                  className="bg-amber-800 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!inputValue.trim() || isLoading}
                  aria-label="Send message"
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatUI;

import React from "react";
//eslint-disable-next-line no-unused-vars
import { motion, useAnimation } from "framer-motion";

const ActionButton = ({
  //eslint-disable-next-line no-unused-vars
  Icon,
  onClick,
  isActive,
  size = "default",
  position,
  animationType = "scale",
  className = "",
  hideOnMobile = false,
}) => {
  const controls = useAnimation();

  const handleClick = () => {
    // Different animation patterns based on type
    switch (animationType) {
      case "slide":
        controls.start({
          x: [0, 40, 0],
          backgroundColor: ["#fbbf24", "#f59e0b", "#fbbf24"],
          transition: {
            duration: 1,
            times: [0, 0.5, 1],
            ease: "easeInOut",
          },
        });
        break;
      case "bounce":
        controls.start({
          y: [0, -10, 0],
          scale: [1, 1.2, 1],
          transition: {
            duration: 0.5,
            times: [0, 0.5, 1],
            ease: "easeInOut",
          },
        });
        break;
      default: // scale
        controls.start({
          scale: [1, 1.4, 1],
          transition: {
            duration: 0.4,
            times: [0, 0.5, 1],
            ease: "easeInOut",
          },
        });
    }
    onClick?.();
  };

  // Size mappings
  const sizeClasses = {
    small: "size-10 sm:size-12",
    default: "size-14 sm:size-12",
    large: "size-16 sm:size-16",
  };

  // Color mappings based on button type
  const colorMappings = {
    heart: {
      active: "fill-red-500 text-red-500",
      inactive: "fill-none text-red-400 hover:text-red-500",
    },
    bookmark: {
      active: "fill-blue-500 text-blue-500",
      inactive: "fill-none text-blue-400 hover:text-blue-500",
    },
    cart: {
      active: "fill-none text-white",
      inactive: "fill-none text-white",
    },
  };

  // Position classes
  const positionClasses = {
    bookmark: "-bottom-4 -right-8 z-1 md:-right-14",
    heart: "-bottom-3 -right-6 md:-right-12 md:-bottom-4 z-2",
    cart: "-bottom-2 -right-5 md:-right-8 z-3",
  };

  // Icon size mappings
  const iconSizes = {
    small: "w-5 h-5 sm:w-6 sm:h-6",
    default: "w-7 h-7 sm:w-6 sm:h-6",
    large: "w-8 h-8 sm:w-8 sm:h-8",
  };

  // Get color classes based on position type
  const getColorClasses = () => {
    const buttonType = position || "cart"; // default to cart if no position specified
    const colorSet = colorMappings[buttonType];
    return isActive ? colorSet.active : colorSet.inactive;
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        flex items-center justify-center
        ${hideOnMobile ? "hidden sm:flex" : "flex"}
        hover:
        p-2 rounded-full shadow-md 
        ${sizeClasses[size]}
        relative ${positionClasses[position]}
        transition-all duration-200
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={animationType === "slide" ? { x: 0 } : { scale: 1 }}
        animate={controls}
      >
        <Icon
          className={`
            ${iconSizes[size]}
            ${getColorClasses()}
            transition-colors duration-200
          `}
        />
      </motion.div>
    </motion.button>
  );
};

export default ActionButton;

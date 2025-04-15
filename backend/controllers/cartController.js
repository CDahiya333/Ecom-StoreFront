import Product from "../models/productModel.js";
import User from "../models/userModel.js";
/**
 * Get the cart items for the current user.
 *
 * Returns an array of product objects with an additional `quantity` field
 * representing the quantity of each item in the user's cart.
 *
 * If the user has no cart items, returns an empty array.
 *
 * @param {import("express").Request} req - The Express HTTP request.
 * @param {import("express").Response} res - The Express HTTP response.
 * @returns {Promise<Product[]>} The list of cart items.
 */
export const getCart = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.cartItems || user.cartItems.length === 0) {
      return res.json([]);
    }

    console.log("Cart items in user document:", JSON.stringify(user.cartItems));
    const productIds = user.cartItems.map((item) => item._id);
    console.log("Product IDs to fetch:", productIds);

    const products = await Product.find({ _id: { $in: productIds } });
    console.log("Products found:", products.length);

    const cartItems = products.map((product) => {
      const cartItem = user.cartItems.find(
        (item) => item._id.toString() === product._id.toString()
      );
      const quantity = cartItem?.quantity ?? 1;

      return {
        ...product.toObject(),
        quantity,
      };
    });

    console.log("Returning cart items:", cartItems.length);
    if (res && typeof res.json === "function") {
      return res.json(cartItems);
    }
    return cartItems;
  } catch (error) {
    console.error("Error in getCart:", error);
    if (res && typeof res.status === "function") {
      return res.status(500).json({ message: error.message });
    }
    throw error;
  }
};

/**
 * @param {Object} req - The request object containing the productId in the body
 * and the user object.
 * @param {Object} res - The response object used to return the updated cart.
 *
 * The user's cartItems array is ensured to be an array of objects with each
 * object containing an _id and quantity field. The function checks if the
 * product already exists in the cart and updates the quantity accordingly.
 */

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!Array.isArray(user.cartItems)) {
      user.cartItems = [];
    }

    const existingItemIndex = user.cartItems.findIndex((item) => {
      return item && item._id && item._id.toString() === productId;
    });

    if (existingItemIndex >= 0) {
      user.cartItems[existingItemIndex].quantity += 1;
    } else {
      user.cartItems.push({
        _id: productId,
        quantity: 1,
      });
    }

    await user.save();
    const updatedUser = await user.constructor.findById(user._id);
    const cartController = await getCart(
      { user: updatedUser },
      { json: (data) => data }
    );

    res.json(cartController);
  } catch (error) {
    console.error("Error in addToCart", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    console.log(`Updating quantity for product ${productId} to ${quantity}`);

    if (!user || !user.cartItems) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingItemIndex = user.cartItems.findIndex(
      (item) => item._id.toString() === productId
    );

    console.log(`Item found at index: ${existingItemIndex}`);

    if (existingItemIndex >= 0) {
      if (quantity <= 0) {
        console.log(`Removing item from cart: ${productId}`);
        user.cartItems = user.cartItems.filter(
          (item) => item._id.toString() !== productId
        );
      } else {
        console.log(`Setting quantity to: ${quantity}`);
        user.cartItems[existingItemIndex].quantity = quantity;
      }

      await user.save();

      const updatedUser = await User.findById(user._id);
      const productIds = updatedUser.cartItems.map((item) => item._id);
      const products = await Product.find({ _id: { $in: productIds } });

      // Build final cart items array
      const cartItems = products.map((product) => {
        const cartItem = updatedUser.cartItems.find(
          (item) => item._id.toString() === product._id.toString()
        );
        const quantity = cartItem?.quantity || 1;
        return {
          ...product.toObject(),
          quantity,
        };
      });

      return res.json(cartItems);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log("Error in updateQuantity:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    console.log("Delete request received for productId:", productId);

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => {
        const itemId = item._id ? item._id.toString() : null;
        return itemId !== productId;
      });
    }
    console.log("Cart after deletion:", user.cartItems);
    await user.save();

    const updatedUser = await user.constructor.findById(user._id);
    const cartController = await getCart(
      { user: updatedUser },
      { json: (data) => data }
    );
    res.json(cartController);
  } catch (error) {
    console.log("Error in deleteFromCart", error.message);
    res.status(500).json({ message: error.message });
  }
};

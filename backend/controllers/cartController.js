import Product from "../models/productModel.js";

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

    // Find the item index using a more reliable comparison
    const existingItemIndex = user.cartItems.findIndex((item) => {
      const itemId = item.productId
        ? item.productId.toString()
        : item.toString();
      return itemId === productId;
    });

    console.log(`Item found at index: ${existingItemIndex}`);

    if (existingItemIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is zero or negative
        console.log(`Removing item from cart: ${productId}`);
        user.cartItems = user.cartItems.filter((item) => {
          const itemId = item.productId
            ? item.productId.toString()
            : item.toString();
          return itemId !== productId;
        });
      } else {
        // Update quantity
        console.log(`Setting quantity to: ${quantity}`);
        if (
          typeof user.cartItems[existingItemIndex] === "object" &&
          user.cartItems[existingItemIndex] !== null
        ) {
          user.cartItems[existingItemIndex].quantity = quantity;
        } else {
          // Convert primitive ID to object
          user.cartItems[existingItemIndex] = {
            productId: user.cartItems[existingItemIndex],
            quantity: quantity,
          };
        }
      }

      // Save user and return complete cart
      await user.save();

      // Use Product.find to get fresh product data
      const productIds = user.cartItems.map((item) =>
        item.productId ? item.productId : item
      );

      const products = await Product.find({ _id: { $in: productIds } });

      // Map products with quantities
      const cartItems = products.map((product) => {
        const cartItem = user.cartItems.find((item) => {
          const itemId = item.productId
            ? item.productId.toString()
            : item.toString();
          return itemId === product._id.toString();
        });

        const quantity = cartItem && cartItem.quantity ? cartItem.quantity : 1;
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
    console.log("Error in updateQuantity", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => {
        const itemId = item.productId
          ? item.productId.toString()
          : item.toString();
        return itemId !== productId;
      });
    }

    await user.save();

    // Return full cart details instead of just cart items array
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

import Product from "../models/productModel.js";

export const getCart = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.cartItems || user.cartItems.length === 0) {
      return res.json([]);
    }

    console.log("Cart items in user document:", JSON.stringify(user.cartItems));

    // Extract product IDs
    const productIds = user.cartItems.map((item) => {
      return item.productId ? item.productId : item;
    });

    console.log("Product IDs to fetch:", productIds);

    const products = await Product.find({ _id: { $in: productIds } });
    console.log("Products found:", products.length);

    // Map products with quantities
    const cartItems = products.map((product) => {
      // Find matching cart item
      const cartItem = user.cartItems.find((item) => {
        const itemId = item.productId
          ? item.productId.toString()
          : item.toString();

        return itemId === product._id.toString();
      });

      // Get quantity
      const quantity = cartItem && cartItem.quantity ? cartItem.quantity : 1;

      // Create a new object with product data and quantity
      return {
        ...product.toObject(),
        quantity,
      };
    });

    console.log("Returning cart items:", cartItems.length);
    res.json(cartItems);
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ message: error.message });
  }
};
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // Make sure user has cartItems array
    if (!user.cartItems) {
      user.cartItems = [];
    }

    // The issue is here - we need to be more careful when accessing item.productId
    const existingItemIndex = user.cartItems.findIndex((item) => {
      if (item && item.productId) {
        return item.productId.toString() === productId;
      }
      if (item) {
        return item.toString() === productId;
      }
      return false;
    });

    if (existingItemIndex >= 0) {
      // If item exists and has quantity property, increment it
      if (user.cartItems[existingItemIndex].quantity) {
        user.cartItems[existingItemIndex].quantity += 1;
      }
      // If it's just an ID, replace with object having quantity
      else {
        const oldId = user.cartItems[existingItemIndex];
        user.cartItems[existingItemIndex] = {
          productId: typeof oldId === "object" ? oldId.productId : oldId,
          quantity: 2, // 1 existing + 1 new
        };
      }
    } else {
      // Add new item with quantity
      user.cartItems.push({
        productId,
        quantity: 1,
      });
    }

    await user.save();

    // Return full cart details instead of just cart items
    const updatedUser = await user.constructor.findById(user._id);
    const cartController = await getCart(
      { user: updatedUser },
      { json: (data) => data }
    );
    res.json(cartController);
  } catch (error) {
    console.log("Error in addToCart", error.message);
    res.status(500).json({ message: error.message });
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

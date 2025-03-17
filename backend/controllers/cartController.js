import Product from "../models/productModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // Make sure user has cartItems array
    if (!user.cartItems) {
      user.cartItems = [];
    }

    // Check if item is already in cart
    // The issue is here - we need to be more careful when accessing item.productId
    const existingItemIndex = user.cartItems.findIndex((item) => {
      // Check if item is an object with productId property
      if (item && item.productId) {
        return item.productId.toString() === productId;
      }
      // Check if item is directly a productId (string or ObjectId)
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
        user.cartItems[existingItemIndex] = {
          productId: user.cartItems[existingItemIndex],
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
    res.json(user.cartItems);
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
      user.cartItems = user.cartItems.filter(
        (item) => item.productId.toString() !== productId
      );
    }
    await user.save();
    res.json(user.cartItems);
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

    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product Not Found !!" });
    }
  } catch (error) {
    console.log("Error in updateQuantity", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = req.body;
    const products = await Product.find({ _id: { $in: user.cartItems } });

    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON, quantity: item.quantity };
    });
    res.json(cartItems);
  } catch (error) {
    console.log("Error in getCart", error.message);
    res.status(500).json({ message: error.message });
  }
};

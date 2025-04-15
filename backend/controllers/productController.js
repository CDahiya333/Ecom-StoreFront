import Product from "../models/productModel.js";
import redis from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts", error.message);
    res.status(500).json({ message: error.message });
  }
};
export const getFeaturedProducts = async (req, res) => {
  try {
    // Caching this in Redis to increase performance
    let featuredProducts = await redis.get("featuredProducts");
    if (featuredProducts) {
      return res.json({ products: JSON.parse(featuredProducts) }); // Return here to stop execution
    }

    // If not present in Redis, fetching from MongoDB
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No Featured Products Found" });
    }

    await redis.set("featuredProducts", JSON.stringify(featuredProducts));
    return res.json({ products: featuredProducts });
  } catch (error) {
    console.log("Error in getFeaturedProducts", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { name, description, price, category } = req.body;
    const isFeatured =
      req.body.isFeatured === "true" || req.body.isFeatured === true;
    let imageUrl = "";

    if (req.file) {
      // Log for debugging
      console.log("File received:", req.file);

      try {
        // Use the absolute path to the file
        const filePath = req.file.path;
        console.log("File path:", filePath);

        if (!fs.existsSync(filePath)) {
          console.error("File does not exist at path:", filePath);
          return res
            .status(400)
            .json({ message: "File not found at expected location" });
        }

        const result = await cloudinary.uploader.upload(filePath, {
          folder: "products",
        });

        console.log("Cloudinary result:", result);
        imageUrl = result.secure_url;

        // Optional: Delete the file after upload to cloudinary
        fs.unlink(filePath, (err) => {
          if (err) console.log("Error deleting file:", err);
        });
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        return res
          .status(400)
          .json({ message: "Image upload failed: " + uploadErr.message });
      }
    } else if (req.body.image) {
      // For image URL from the request body
      try {
        console.log("Using image URL:", req.body.image);
        const result = await cloudinary.uploader.upload(req.body.image, {
          folder: "products",
        });
        imageUrl = result.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        return res
          .status(400)
          .json({ message: "Image upload failed: " + uploadErr.message });
      }
    } else {
      return res.status(400).json({ message: "Image is required" });
    }

    console.log("Creating product with imageUrl:", imageUrl);

    const productData = {
      name,
      description,
      price: Number(price),
      image: imageUrl,
      category,
      isFeatured: isFeatured || false,
    };

    console.log("Product data:", productData);

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("deleted image from cloudinary");
      } catch (error) {
        console.log("error deleting image from cloudinary", error);
      }
    }

    // Fix: Use Product model to delete, not the product instance
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product Deleted Successfully" });
  } catch (error) {
    console.log("Error in deleteProduct", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: {
          size: 3,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
        },
      },
    ]);
    console.log(products);
    res.json({ products });
  } catch (error) {
    console.log("Error in getRecommendedProducts", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getProductsbyCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsbyCategory", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const toggleFeaturedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    } else {
      product.isFeatured = !product.isFeatured;
      // Fix: Use the product instance to save, not the model
      const updatedProduct = await product.save();
      await featuredProductsCache();
      res.json(updatedProduct);
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProducts", error.message);
    res.status(500).json({ message: error.message });
  }
};

async function featuredProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featuredProducts", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in featuredProductsCache", error.message);
    res.status(500).json({ message: error.message });
  }
}

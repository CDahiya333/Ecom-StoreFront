import Product from "../models/productModel.js";
import redis from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js"

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
    // Caching this in Redis to increased performance
    let featuredProducts = await redis.get("featuredProducts");
    if (featuredProducts) {
      res.json({ products: JSON.parse(featuredProducts) });
    }

    // If not present in Redis fetching from MongoDB
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No Featured Products Found" });
    }

    await redis.set("featuredProducts", JSON.stringify(featuredProducts));
    res.json({ products: featuredProducts });
  } catch (error) {
    console.log("Error in getFeaturedProducts", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, isFeatured } = req.body;
    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products", 
      });

      imageUrl = result.secure_url;
    } else if (req.body.image) {
      // Check if an image URL or base64 string is provided in the body
      const result = await cloudinary.uploader.upload(req.body.image, {
        folder: "products",
      });
      imageUrl = result.secure_url;
    } else {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: imageUrl,
      category,
      isFeatured,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    // TODO: DELETE FROM AWS S3 BUCKET

    await product.findByIdAndDelete(id);
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
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
        },
      },
    ]);
    res.json({ products });
  } catch (error) {
    console.log("Error in getRecommendedProducts", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getProductsbyCategory = async (req, res) => {
    const {Category}  =req.params.category;
  try {
    const products = await Product.find({ Category });
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
    }else{
        product.isFeatured = !product.isFeatured;
        const updatedProduct = await Product.save();
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
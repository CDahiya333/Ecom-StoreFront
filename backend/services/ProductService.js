// services/ProductService.js
import Product from "../models/productModel.js";

export const getFormattedProductList = async () => {
  try {
    // Directly fetch demo products in production
    if(process.env.USE_DEMO_PRODUCTS === 'true') return getDemoProductList();

    const products = await Product.find({}).lean();
    
    let formattedList = "";
    
    products.forEach(product => {
      const priceInDollars = `$${product.price.toFixed(2)}`;
      formattedList += `- ${product.name} (${product.category}): ${priceInDollars} - ${product.description}\n`;
    });
    
    return formattedList;
  } catch (error) {
    // FailOver
    console.error("Error fetching products:", error);
    return getDemoProductList();
  }
};

export const getDemoProductList = () => {
  const products = [
    {
      product_name: "Artisan Oak Dining Table",
      material: "Solid Oak",
      price_range: "$1,200 - $1,800",
      description: "Hand-crafted dining table with natural grain patterns"
    },
    {
      product_name: "Walnut Bookshelf",
      material: "Walnut Wood",
      price_range: "$850 - $1,100",
      description: "Elegant bookshelf with adjustable shelves"
    },
    {
      product_name: "Maple Wood Coffee Table",
      material: "Maple Wood",
      price_range: "$600 - $900",
      description: "Modern coffee table with storage compartment"
    },
    {
      product_name: "Teak Outdoor Lounger",
      material: "Teak Wood",
      price_range: "$1,400 - $1,800",
      description: "Weather-resistant lounger for patio or garden"
    },
    {
      product_name: "Cherry Wood Bed Frame",
      material: "Cherry Wood",
      price_range: "$1,500 - $2,200",
      description: "Classic bed frame with headboard"
    },
    {
      product_name: "Sandalwood Scented Candles",
      material: "Soy Wax & Sandalwood",
      price_range: "$35 - $55",
      description: "Long-burning premium candles with natural fragrances"
    },
    {
      product_name: "Handwoven Rattan Basket Set",
      material: "Natural Rattan",
      price_range: "$120 - $180",
      description: "Set of three decorative storage baskets"
    },
    {
      product_name: "Marble & Wood Cutting Board",
      material: "Marble and Acacia Wood",
      price_range: "$75 - $95",
      description: "Luxury cutting and serving board"
    },
    {
      product_name: "Himalayan Salt Lamp",
      material: "Natural Himalayan Salt",
      price_range: "$45 - $85",
      description: "Ambient lighting with air-purifying properties"
    },
    {
      product_name: "Ceramic Vase Collection",
      material: "Handcrafted Ceramic",
      price_range: "$60 - $120",
      description: "Artisanal vases in various shapes and sizes"
    },
    {
      product_name: "Bamboo Kitchen Utensil Set",
      material: "Sustainable Bamboo",
      price_range: "$40 - $65",
      description: "Complete set of eco-friendly kitchen tools"
    },
    {
      product_name: "Mahogany Desk",
      material: "Mahogany Wood",
      price_range: "$1,100 - $1,600",
      description: "Executive desk with drawers and cable management"
    }
  ];

  // Format the product list for the prompt
  let formattedList = "";
  products.forEach(product => {
    formattedList += `- ${product.product_name} (${product.material}): ${product.price_range} - ${product.description}\n`;
  });

  return formattedList;
};
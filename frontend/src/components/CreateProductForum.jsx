import { useState } from "react";
import { PlusCircle, Upload, Loader } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import useProductStore from "../Stores/useProductStore.js";

const categories = [
  "living-room-furniture",
  "bedroom-furniture",
  "dining-office-furniture",
  "candles",
  "decor-accessories",
  "cutlery",
];

const CreateProductForum = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  // Correct usage of the hook:
  const { createProduct, loading } = useProductStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      // Clear the image URL field when a file is selected
      setNewProduct((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");

    // Check if neither a file nor an image URL is provided
    if (!selectedFile && !newProduct.image) {
      setFeedback("Image is required.");
      return;
    }

    try {
      let productData;

      // If a file is selected, use FormData
      if (selectedFile) {
        productData = new FormData();
        // Add all form fields to FormData
        Object.keys(newProduct).forEach((key) => {
          // Skip the image field if we're using a file
          if (key !== "image" || !selectedFile) {
            productData.append(key, newProduct[key]);
          }
        });

        // Add the file last
        productData.append("image", selectedFile);

        // Log the data for debugging
        console.log("Form data entries:");
        for (let pair of productData.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }
      } else {
        // Just send the object if using an image URL
        productData = { ...newProduct };
      }

      const result = await createProduct(productData);
      console.log("Creation result:", result);
      setFeedback("Product created successfully!");

      // Clear form and preview
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
      setSelectedFile(null);
      setPreviewImage(null);

      // Revoke the object URL to prevent memory leaks
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setFeedback(
        error.response?.data?.message ||
          "Error creating product. Please try again."
      );
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto" // modern, centered form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={newProduct.description}
          onChange={handleChange}
          required
          rows={10} // increased height for a larger text area
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category"
          value={newProduct.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace(/-/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Or provide an image URL
          </label>
          <input
            type="text"
            name="image"
            value={newProduct.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500"
            disabled={!!selectedFile}
          />
          {newProduct.image && !selectedFile && (
            <div className="mt-2">
              <img
                src={newProduct.image}
                alt="URL Preview"
                className="h-40 w-auto object-cover rounded-md"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image Upload
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-800 file:text-white hover:file:bg-amber-700"
            />
          </div>
          {previewImage && (
            <div className="mt-2">
              <img
                src={previewImage}
                alt="Preview"
                className="h-40 w-auto object-cover rounded-md"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <motion.button
          type="submit"
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-800 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="animate-spin mr-2" size={20} />
              Creating...
            </>
          ) : (
            <>
              <PlusCircle size={20} className="mr-2" />
              Create Product
            </>
          )}
        </motion.button>
      </div>

      {feedback && (
        <p
          className={`text-center text-sm ${
            feedback.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {feedback}
        </p>
      )}
    </motion.form>
  );
};

export default CreateProductForum;

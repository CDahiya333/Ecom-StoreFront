// uploadMiddleware.js
import multer from "multer";

// Temporary storage (file will be removed after upload to Cloudinary)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });

// middlewares/upload.middleware.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Usar CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products", // carpeta en Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 600, height: 600, crop: "limit" }],
  },
});

//filtro
const fileFilter = (req, file, next) => {
  //tipos de archivo permitidos que puede recibir el servidor
  const allowedType = /jpeg|jpg|png|webp/;
  //testear si el nombre del archivo coincide
  const ext = allowedType.test(path.extname(file.originalname));
  const mimetype = allowedType.test(file.mimetype);

  //verificar que se cumplan ambas condiciones
  if (ext && mimetype) {
    next(null, true);
  } else {
    return next(new Error("extension invalida jpeg | jpg | png | webp"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
export default upload;

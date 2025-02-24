import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({});

if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
    console.error("Cloudinary configuration is missing environment variables");
    process.exit(1);
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

export default cloudinary;

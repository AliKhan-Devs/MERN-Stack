import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
  try {
    let imageData = file;
    
    // If it's a base64 string, handle the data URL format
    if (typeof file === 'string' && file.includes('base64')) {
      // Remove the data:image/[type];base64 prefix if present
      imageData = file.replace(/^data:image\/\w+;base64,/, '');
      imageData = `data:image/png;base64,${imageData}`;
    }
    
    const result = await cloudinary.uploader.upload(imageData, {
      folder: 'appointment-system',
      use_filename: true,
      unique_filename: true,
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}; 
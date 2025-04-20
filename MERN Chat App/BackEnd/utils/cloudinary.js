import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadToCloudinary = async (file, folder) => {
  try {
    // If file is a buffer (from memory storage)
    if (Buffer.isBuffer(file)) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: folder },
          (error, result) => {
            if (error) reject(error)
            resolve(result)
          }
        ).end(file)
      })
      return result.secure_url
    }
    
    // If file is a path (for backward compatibility)
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
    })
    return result.secure_url
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    throw new Error("Could not upload file to Cloudinary")
  }
}

export default cloudinary
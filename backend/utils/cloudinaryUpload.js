import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} folder - Cloudinary folder name (products, shops, profiles)
 * @param {string} publicId - Optional custom public ID
 * @returns {Promise<object>} Cloudinary upload result
 */
const uploadToCloudinary = async (filePath, folder, publicId = null) => {
  try {
    const options = {
      folder: `smart-deliver/${folder}`,
      resource_type: 'auto',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    };

    if (publicId) {
      options.public_id = publicId;
    }

    const result = await cloudinary.uploader.upload(filePath, options);

    // Delete local file after successful upload
    fs.unlinkSync(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    // Delete local file even if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of file objects with path property
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Array>} Array of upload results
 */
const uploadMultipleToCloudinary = async (files, folder) => {
  try {
    const uploadPromises = files.map(file => 
      uploadToCloudinary(file.path, folder)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} Deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array<string>} publicIds - Array of Cloudinary public IDs
 * @returns {Promise<object>} Deletion result
 */
const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} Public ID
 */
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  
  // Extract public ID from Cloudinary URL
  // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/smart-deliver/products/abc123.jpg
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  
  if (uploadIndex === -1) return null;
  
  // Get everything after 'upload/v1234567890/'
  const pathParts = parts.slice(uploadIndex + 2);
  const publicIdWithExtension = pathParts.join('/');
  
  // Remove file extension
  const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');
  
  return publicId;
};

export {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  getPublicIdFromUrl
};

import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '@env';

export const cloudinaryConfig = {
  cloudName: CLOUDINARY_CLOUD_NAME,
  apiKey: CLOUDINARY_API_KEY,
  apiSecret: CLOUDINARY_API_SECRET,
  uploadPreset: 'kgrillhub_users',
};

export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
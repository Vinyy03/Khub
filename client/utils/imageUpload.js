import * as ImageManipulator from 'expo-image-manipulator';
import { cloudinaryConfig, CLOUDINARY_URL } from './cloudinaryConfig';

export const uploadImageToCloudinary = async (imageUri) => {
  try {
    // Resize and compress the image for better upload performance
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 500 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    // Create form data for upload
    const formData = new FormData();
    
    // Get the filename from the URI
    const uriParts = manipResult.uri.split('/');
    const filename = uriParts[uriParts.length - 1];
    
    // Append the image and upload preset
    formData.append('file', {
      uri: manipResult.uri,
      type: 'image/jpeg',
      name: filename,
    });
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    
    // Upload to Cloudinary
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    // Return the secure URL of the uploaded image
    return data.secure_url;
    
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};
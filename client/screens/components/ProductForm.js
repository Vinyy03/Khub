import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../redux/slices/categorySlice';
import CustomCheckbox from './../CustomCheckbox'; // Import our custom checkbox

const ProductForm = ({ initialValues = {}, onSubmit, isSubmitting }) => {
  const dispatch = useDispatch();
  const { categories, isLoading: categoriesLoading } = useSelector((state) => state.categories);
  
  // Form state
  const [name, setName] = useState(initialValues.name || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [price, setPrice] = useState(initialValues.price ? initialValues.price.toString() : '');
  const [image, setImage] = useState(initialValues.image || null);
  const [selectedCategories, setSelectedCategories] = useState(initialValues.categories || []);
  
  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Pick an image from the device
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
        return;
      }
      
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  // Toggle category selection
  const toggleCategory = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Product name is required');
      return false;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Description is required');
      return false;
    }
    
    if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Price must be a positive number');
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    // Create product data object
    const productData = {
      name,
      description,
      price: parseFloat(price),
      categories: selectedCategories,
      image,
    };
    
    onSubmit(productData);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Product Name*</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter product name"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description*</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter product description"
          multiline
          numberOfLines={5}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Price*</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Product Image</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <MaterialIcons name="add-photo-alternate" size={24} color="#007BFF" />
          <Text style={styles.imagePickerText}>
            {image ? 'Change Image' : 'Select Image'}
          </Text>
        </TouchableOpacity>
        {image && (
          <Image source={{ uri: image }} style={styles.previewImage} />
        )}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Categories</Text>
        {categoriesLoading ? (
          <ActivityIndicator size="small" color="#007BFF" />
        ) : (
          <View style={styles.categoriesContainer}>
            {categories?.map((category) => (
              <View key={category?._id || Math.random().toString()} style={styles.categoryItem}>
                <CustomCheckbox 
                  value={selectedCategories.includes(category?.name)}
                  onValueChange={() => toggleCategory(category?.name)}
                  label={category?.name}
                />
              </View>
            ))}
            {(!categories || categories.length === 0) && (
              <Text style={styles.noCategories}>No categories available</Text>
            )}
          </View>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.submitButtonText}>
            {initialValues._id ? 'Update Product' : 'Create Product'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePickerText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007BFF',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryItem: {
    paddingVertical: 8,
  },
  noCategories: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    padding: 10,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductForm;
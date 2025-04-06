import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, 
  ActivityIndicator, Modal, TextInput 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  clearCategoryError 
} from '../../redux/slices/categorySlice';
import { MaterialIcons } from '@expo/vector-icons';

const AdminCategoriesScreen = () => {
  const dispatch = useDispatch();
  const { categories, isLoading, error } = useSelector((state) => state.categories);

  // Local state for form handling
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Fetch categories when component mounts
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearCategoryError());
    }
  }, [error, dispatch]);

  // Function to handle form submission
  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Category name is required');
      return;
    }
    
    if (isEditMode && currentCategoryId) {
      // Update existing category
      const categoryData = {
        name,
        description,
      };
      
      dispatch(updateCategory({ id: currentCategoryId, categoryData }))
        .unwrap()
        .then(() => {
          resetForm();
          setModalVisible(false);
          Alert.alert('Success', 'Category updated successfully');
        });
    } else {
      // Create new category
      dispatch(createCategory({ name, description }))
        .unwrap()
        .then(() => {
          resetForm();
          setModalVisible(false);
          Alert.alert('Success', 'Category created successfully');
        });
    }
  };

  // Function to handle edit button press
  const handleEdit = (category) => {
    setIsEditMode(true);
    setCurrentCategoryId(category._id);
    setName(category.name);
    setDescription(category.description || '');
    setModalVisible(true);
  };

  // Function to handle delete button press
  const handleDelete = (category) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete the category "${category.name}"?${
        category.productCount > 0 
          ? ` It is used by ${category.productCount} products.` 
          : ''
      }`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            dispatch(deleteCategory(category._id))
              .unwrap()
              .then(() => {
                Alert.alert('Success', 'Category deleted successfully');
              });
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Function to reset the form
  const resetForm = () => {
    setName('');
    setDescription('');
    setIsEditMode(false);
    setCurrentCategoryId(null);
  };

  // Function to close modal and reset form
  const handleCloseModal = () => {
    resetForm();
    setModalVisible(false);
  };

  // Function to render each category item
  const renderCategoryItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryName}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.categoryDescription}>{item.description}</Text>
        ) : null}
        <Text style={styles.productCount}>{item.productCount} products</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => handleEdit(item)}
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDelete(item)}
        >
          <MaterialIcons name="delete" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={categories}
            keyExtractor={(item) => item._id}
            renderItem={renderCategoryItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No categories found</Text>
            }
          />
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              setIsEditMode(false);
              setModalVisible(true);
            }}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Category</Text>
          </TouchableOpacity>
        </>
      )}
      
      {/* Category Form Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditMode ? 'Edit Category' : 'Add New Category'}
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name*</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Category Name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Category Description"
                multiline
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseModal}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 80,
  },
  categoryItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  productCount: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#0066cc',
  },
  deleteButton: {
    backgroundColor: '#cc0000',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 50,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0066cc',
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  input: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminCategoriesScreen;
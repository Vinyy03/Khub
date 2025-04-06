import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const AdminCategoriesScreen = () => {
  // Sample categories data
  const categories = [
    { id: '1', name: 'Main Course', productCount: 12 },
    { id: '2', name: 'Sides', productCount: 8 },
    { id: '3', name: 'Beverages', productCount: 10 },
    { id: '4', name: 'Desserts', productCount: 6 },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.productCount}>{item.productCount} products</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories Management</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default AdminCategoriesScreen;
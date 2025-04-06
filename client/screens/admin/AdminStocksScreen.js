import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const AdminStocksScreen = () => {
  // Sample stocks data
  const stocks = [
    { id: '1', product: 'Chicken', quantity: 50, unit: 'kg', status: 'In Stock' },
    { id: '2', product: 'Beef', quantity: 30, unit: 'kg', status: 'In Stock' },
    { id: '3', product: 'Pork Ribs', quantity: 5, unit: 'kg', status: 'Low Stock' },
    { id: '4', product: 'Vegetables', quantity: 0, unit: 'kg', status: 'Out of Stock' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.stockItem}>
      <Text style={styles.stockProduct}>{item.product}</Text>
      <View style={styles.stockDetailsRow}>
        <Text style={styles.stockQuantity}>{item.quantity} {item.unit}</Text>
        <Text style={[
          styles.stockStatus, 
          {color: 
            item.status === 'In Stock' ? '#28a745' : 
            item.status === 'Low Stock' ? '#ffc107' : '#dc3545'}
        ]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stocks Management</Text>
      <FlatList
        data={stocks}
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
  stockItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  stockProduct: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stockQuantity: {
    fontSize: 14,
    color: '#666',
  },
  stockStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AdminStocksScreen;
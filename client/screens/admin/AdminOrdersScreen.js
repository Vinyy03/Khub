import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const AdminOrdersScreen = () => {
  // Sample orders data
  const orders = [
    { id: '1', customer: 'John Doe', date: '2023-04-15', total: 42.97, status: 'Delivered' },
    { id: '2', customer: 'Jane Smith', date: '2023-04-16', total: 25.98, status: 'Processing' },
    { id: '3', customer: 'Bob Johnson', date: '2023-04-17', total: 34.97, status: 'Pending' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderCustomer}>{item.customer}</Text>
      <Text style={styles.orderDate}>{item.date}</Text>
      <View style={styles.orderDetailsRow}>
        <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
        <Text style={[
          styles.orderStatus, 
          {color: item.status === 'Delivered' ? '#28a745' : item.status === 'Processing' ? '#ffc107' : '#dc3545'}
        ]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders Management</Text>
      <FlatList
        data={orders}
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
  orderItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderCustomer: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  orderDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AdminOrdersScreen;
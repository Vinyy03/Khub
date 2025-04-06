import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Add this import
import { useDispatch, useSelector } from 'react-redux';
import { getUserOrders } from '../redux/slices/orderSlice';
import { format } from 'date-fns';

const OrderHistory = () => {
  const navigation = useNavigation(); // Add navigation hook
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.order);

  // In OrderHistory.js component
  useEffect(() => {
    console.log('Fetching orders...');
    dispatch(getUserOrders());
  }, [dispatch]);

  useEffect(() => {
    console.log('Order state:', { orders, isLoading, error });
  }, [orders, isLoading, error]);

  // Add console log to debug the orders data
  useEffect(() => {
    console.log('Orders data:', orders);
  }, [orders]);

  // Format the date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107'; // yellow
      case 'processing': return '#17a2b8'; // info blue
      case 'shipped': return '#007bff'; // primary blue
      case 'delivered': return '#28a745'; // green
      case 'cancelled': return '#dc3545'; // red
      default: return '#6c757d'; // gray
    }
  };

  // Render each order
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item._id?.substring(0, 8) || 'N/A'}</Text>
        <Text style={[styles.orderStatus, { color: getStatusColor(item.status || 'pending') }]}>
          {(item.status || 'pending').toUpperCase()}
        </Text>
      </View>

      <Text style={styles.orderDate}>
        Placed on {item.createdAt ? formatDate(item.createdAt) : 'N/A'}
      </Text>

      <View style={styles.orderItems}>
        {item.items && item.items.length > 0 ?
          item.items.map((orderItem, index) => (
            <Text key={index} style={styles.item}>
              {orderItem.quantity}x {orderItem.name}
            </Text>
          ))
          :
          <Text style={styles.item}>No items in this order</Text>
        }
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>
          Total: ${(item.amount || 0).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading orders: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(getUserOrders())}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Orders</Text>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id || Math.random().toString()}
        contentContainerStyle={styles.ordersList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't placed any orders yet.</Text>
            <TouchableOpacity
              style={styles.shopNowButton}
              onPress={() => navigation.navigate('Main', { screen: 'Home' })}
            >
              <Text style={styles.shopNowButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  ordersList: {
    paddingBottom: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  orderItems: {
    marginBottom: 12,
  },
  item: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  viewDetailsButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  viewDetailsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  shopNowButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OrderHistory;
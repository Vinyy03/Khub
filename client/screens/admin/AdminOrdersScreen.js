import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import { format } from 'date-fns';
import { Picker } from '@react-native-picker/picker';

const AdminOrdersScreen = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, updateLoading, error } = useSelector((state) => state.order);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch orders when component mounts
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // Add debug logging - place here
  useEffect(() => {
    console.log('Admin orders loaded:', orders);
  }, [orders]);

  useEffect(() => {
    if (error) {
      console.error('Admin orders error:', error);
    }
  }, [error]);

  // Function to handle order status update
  // Update the handleUpdateStatus function
// Update the handleUpdateStatus function with better logging
// Update the handleUpdateStatus function with better logging and error handling
const handleUpdateStatus = (orderId, newStatus) => {
  console.log(`Attempting to update order ${orderId} to status: ${newStatus}`);
  
  Alert.alert(
    "Update Order Status",
    `Are you sure you want to change this order's status to ${newStatus}?`,
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { 
        text: "Yes, Update", 
        onPress: () => {
          console.log(`Dispatching update for order ${orderId}`);
          
          dispatch(updateOrderStatus({ orderId, status: newStatus }))
            .unwrap()
            .then((result) => {
              console.log('Order update success:', JSON.stringify(result));
              
              // Check for success flag in the response
              if (result && result.success) {
                Alert.alert("Success", `Order status updated to ${newStatus}`);
                // Force a refresh of the orders list
                dispatch(getAllOrders());
              } else {
                // This should not happen with proper backend response
                Alert.alert("Warning", "Status updated but response format unexpected");
                dispatch(getAllOrders());
              }
            })
            .catch(error => {
              // Log the actual error for debugging
              console.error('Order update error:', typeof error, error);
              
              let errorMessage = "Failed to update order status";
              
              // Try to extract a meaningful error message
              if (typeof error === 'string') {
                errorMessage = error;
              } else if (error?.message) {
                errorMessage = error.message;
              }
              
              Alert.alert("Error", errorMessage);
            });
        }
      }
    ]
  );
};

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(getAllOrders())
      .finally(() => setRefreshing(false));
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString || 'N/A';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '#28a745'; // green
      case 'processing': return '#ffc107'; // yellow
      case 'shipped': return '#17a2b8';   // blue
      case 'pending': return '#dc3545';   // red
      case 'cancelled': return '#6c757d'; // gray
      default: return '#6c757d';          // gray
    }
  };

  // Render order item
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderCustomer}>
          {item.user?.name || 'Unknown Customer'}
        </Text>
        <Text style={styles.orderId}>Order #{item._id?.substring(0, 8) || 'N/A'}</Text>
      </View>

      <Text style={styles.orderDate}>
        Placed on {formatDate(item.createdAt)}
      </Text>

      <View style={styles.itemsList}>
        {item.items && item.items.length > 0 ? (
          item.items.map((orderItem, index) => (
            <Text key={index} style={styles.itemText}>
              {orderItem.quantity}x {orderItem.name || 'Product'}
            </Text>
          ))
        ) : (
          <Text style={styles.itemText}>No items</Text>
        )}
      </View>

      <View style={styles.orderDetailsRow}>
        <Text style={styles.orderTotal}>
          Total: ${(item.amount || 0).toFixed(2)}
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Current Status:</Text>
        <Text style={[
          styles.orderStatus, 
          { color: getStatusColor(item.status) }
        ]}>
          {(item.status || 'pending').toUpperCase()}
        </Text>
      </View>

      <View style={styles.statusUpdateSection}>
        <Text style={styles.updateLabel}>Update Status:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={item.status || 'pending'}
            style={styles.statusPicker}
            onValueChange={(value) => handleUpdateStatus(item._id, value)}
            enabled={!updateLoading}
          >
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Processing" value="processing" />
            <Picker.Item label="Shipped" value="shipped" />
            <Picker.Item label="Delivered" value="delivered" />
            <Picker.Item label="Cancelled" value="cancelled" />
          </Picker>
        </View>
      </View>
    </View>
  );

  // Show loading state
  if (isLoading && !refreshing) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(getAllOrders())}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders Management</Text>
      
      {updateLoading && (
        <View style={styles.updateLoadingBanner}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.updateLoadingText}>Updating order status...</Text>
        </View>
      )}
      
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item._id || item.id || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  updateLoadingBanner: {
    backgroundColor: '#0066CC',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  updateLoadingText: {
    color: 'white',
    marginLeft: 10,
  },
  orderItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderCustomer: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderId: {
    fontSize: 14,
    color: '#666',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  itemsList: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 3,
  },
  orderDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  statusLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusUpdateSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  updateLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  statusPicker: {
    height: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AdminOrdersScreen;
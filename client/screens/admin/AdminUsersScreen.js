import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, 
  TouchableOpacity, RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUsers, 
  deleteUserById, 
  clearUserError 
} from '../../redux/slices/userSlice';

const AdminUsersScreen = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error, deleteLoading } = useSelector((state) => state.users);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearUserError());
    }
  }, [error, dispatch]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchUsers())
      .finally(() => setRefreshing(false));
  };

  // Handle delete user
  const handleDeleteUser = (userId, username) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            dispatch(deleteUserById(userId))
              .unwrap()
              .then(() => {
                Alert.alert('Success', 'User deleted successfully');
              })
              .catch((error) => {
                console.error('Error deleting user:', error);
              });
          }
        }
      ]
    );
  };

  // Render user item
  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.badgeContainer}>
          {item.isAdmin && (
            <View style={styles.adminBadge}>
              <Text style={styles.badgeText}>Admin</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity onPress={() => handleDeleteUser(item._id, item.username)}>
          <MaterialIcons name="delete" size={24} color="#FF4D4D" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Show loading state
  if (isLoading && !refreshing) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users Management</Text>
      
      {deleteLoading && (
        <View style={styles.updateLoadingBanner}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.updateLoadingText}>Deleting user...</Text>
        </View>
      )}
      
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0066CC']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
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
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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
  listContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  adminBadge: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AdminUsersScreen;
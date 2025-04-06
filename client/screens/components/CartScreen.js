import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, deleteProduct } = useCart();
  const navigation = useNavigation();

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Handle navigation to Home/Shop
  const navigateToHome = () => {
    navigation.navigate('Main', { screen: 'Home' });
  };

  // Render each cart item
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <TouchableOpacity onPress={() => decreaseQuantity(item.cartItemId || item._id)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => increaseQuantity(item.cartItemId || item._id)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => deleteProduct(item.cartItemId || item._id)} style={styles.deleteButton}>
        <Icon name="trash" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.cartItemId || item._id || String(Math.random())}
        contentContainerStyle={styles.cartList}
        ListEmptyComponent={
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity style={styles.shopAgainButton} onPress={navigateToHome}>
              <Text style={styles.shopAgainButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        }
      />
      {cartItems.length > 0 && (
        <>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shopAgainButton} onPress={navigateToHome}>
              <Text style={styles.shopAgainButtonText}>Shop Again</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  cartList: {
    flexGrow: 1,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityLabel: {
    marginRight: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    marginLeft: 16,
    backgroundColor: '#ff6347',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  buttonsContainer: {
    marginTop: 16,
    gap: 10,
  },
  checkoutButton: {
    backgroundColor: '#ff6347',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shopAgainButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  shopAgainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
});

export default CartScreen;
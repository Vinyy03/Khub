import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../screens/context/CartContext'; // Import CartContext

const HomeScreen = () => {
  const navigation = useNavigation();
  const { cartItems, toastMessage } = useCart(); // Access cartItems and toastMessage from CartContext
  const [searchQuery, setSearchQuery] = useState('');
  const [products] = useState([
    { id: '1', name: 'Grilled Chicken', price: '12.99', image: 'https://nebraskastarbeef.com/wp-content/uploads/2022/09/52913995_m-scaled.jpg' },
    { id: '2', name: 'BBQ Ribs', price: '15.99', image: 'https://nebraskastarbeef.com/wp-content/uploads/2022/09/52913995_m-scaled.jpg' },
    { id: '3', name: 'Veggie Skewers', price: '9.99', image: 'https://nebraskastarbeef.com/wp-content/uploads/2022/09/52913995_m-scaled.jpg' },
    { id: '4', name: 'Steak', price: '19.99', image: 'https://nebraskastarbeef.com/wp-content/uploads/2022/09/52913995_m-scaled.jpg' },
    { id: '5', name: 'Grilled Salmon', price: '17.99', image: 'https://nebraskastarbeef.com/wp-content/uploads/2022/09/52913995_m-scaled.jpg' },
    { id: '6', name: 'Pork Chops', price: '14.99', image: 'https://nebraskastarbeef.com/wp-content/uploads/2022/09/52913995_m-scaled.jpg' },
    { id: '7', name: 'Chicken Wings', price: '10.99', image: 'https://nebraskastarbeef.com/wp-content/uploads/2022/09/52913995_m-scaled.jpg' },
    { id: '8', name: 'Lamb Chops', price: '22.99', image: 'https://nebraskastarbeef.com/wp-content/uploads/2022/09/52913995_m-scaled.jpg' },
    { id: '9', name: 'Grilled Shrimp', price: '18.99', image: 'https://nebraskastarbeef.com/wp-content/uploads/2022/09/52913995_m-scaled.jpg' },
    { id: '10', name: 'Corn on the Cob', price: '5.99', image: 'https://nebraskastarbeef.com/wp-content/uploads/2022/09/52913995_m-scaled.jpg' },
  ]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient colors={['#ffecd2', '#fcb69f']} style={styles.gradient}>
      <View style={styles.container}>
        {/* Cart Button */}
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartButtonText}>Cart ({cartItems.length})</Text>
        </TouchableOpacity>

        <Text style={styles.title}>KGrillHub</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productItem}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            >
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </TouchableOpacity>
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
        {toastMessage && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  cartButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productItem: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  toast: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
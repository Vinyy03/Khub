import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { createOrder, clearOrderError, clearOrderSuccess } from '../../redux/slices/orderSlice';

// Custom RadioButton component
const CustomRadioButton = ({ selected, onPress, label }) => (
  <TouchableOpacity 
    style={styles.paymentOption}
    onPress={onPress}
  >
    <View style={styles.radioButtonOuter}>
      {selected && <View style={styles.radioButtonInner} />}
    </View>
    <Text style={styles.paymentLabel}>{label}</Text>
  </TouchableOpacity>
);

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { cartItems, clearCart } = useCart();
  const { user } = useSelector((state) => state.auth);
  const { isLoading, error, success, currentOrder } = useSelector((state) => state.order);

  // Form state
  const [address, setAddress] = useState({
    street: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    country: user?.country || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Handle error and success
// Update the success alert navigation in useEffect
useEffect(() => {
  if (error) {
    Alert.alert('Error', error);
    dispatch(clearOrderError());
  }

  if (success && currentOrder) {
    clearCart();
    Alert.alert(
      'Order Placed Successfully!',
      'Your order has been placed successfully.',
      [
        {
          text: 'View My Orders',
          onPress: () => navigation.navigate('Main', { screen: 'Order History' }) // Fixed navigation
        },
        {
          text: 'Continue Shopping',
          onPress: () => navigation.navigate('Main', { screen: 'Home' }),
          style: 'default',
        },
      ]
    );
    dispatch(clearOrderSuccess());
  }
}, [error, success, currentOrder, dispatch, navigation, clearCart]);

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Handle input change
  const handleAddressChange = (field, value) => {
    setAddress({ ...address, [field]: value });
  };

  // Validate form
  const validateForm = () => {
    if (!address.street.trim()) {
      Alert.alert('Error', 'Street address is required');
      return false;
    }
    if (!address.city.trim()) {
      Alert.alert('Error', 'City is required');
      return false;
    }
    if (!address.zipCode.trim()) {
      Alert.alert('Error', 'Zip/Postal code is required');
      return false;
    }
    if (!address.country.trim()) {
      Alert.alert('Error', 'Country is required');
      return false;
    }
    return true;
  };

  // Handle order placement
  const placeOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Format the order data
    const orderData = {
      items: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity
      })),
      amount: parseFloat(calculateTotal()),
      address,
      paymentMethod
    };

    dispatch(createOrder(orderData));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Checkout</Text>

      {/* Items Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Order Summary</Text>
        {cartItems.map((item) => (
          <View key={item.cartItemId || item._id} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>${calculateTotal()}</Text>
        </View>
      </View>

      {/* Shipping Address */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Shipping Address</Text>
        
        <Text style={styles.label}>Street Address*</Text>
        <TextInput
          style={styles.input}
          value={address.street}
          onChangeText={(text) => handleAddressChange('street', text)}
          placeholder="Enter your street address"
        />
        
        <Text style={styles.label}>City*</Text>
        <TextInput
          style={styles.input}
          value={address.city}
          onChangeText={(text) => handleAddressChange('city', text)}
          placeholder="Enter your city"
        />
        
        <Text style={styles.label}>State/Province</Text>
        <TextInput
          style={styles.input}
          value={address.state}
          onChangeText={(text) => handleAddressChange('state', text)}
          placeholder="Enter your state/province"
        />
        
        <Text style={styles.label}>Zip/Postal Code*</Text>
        <TextInput
          style={styles.input}
          value={address.zipCode}
          onChangeText={(text) => handleAddressChange('zipCode', text)}
          placeholder="Enter your zip/postal code"
          keyboardType="number-pad"
        />
        
        <Text style={styles.label}>Country*</Text>
        <TextInput
          style={styles.input}
          value={address.country}
          onChangeText={(text) => handleAddressChange('country', text)}
          placeholder="Enter your country"
        />
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Payment Method</Text>
        
        <CustomRadioButton
          selected={paymentMethod === 'credit_card'}
          onPress={() => setPaymentMethod('credit_card')}
          label="Credit Card"
        />
        
        <CustomRadioButton
          selected={paymentMethod === 'paypal'}
          onPress={() => setPaymentMethod('paypal')}
          label="PayPal"
        />
        
        <CustomRadioButton
          selected={paymentMethod === 'cash'}
          onPress={() => setPaymentMethod('cash')}
          label="Cash on Delivery"
        />
      </View>

      {/* Place Order Button */}
      <TouchableOpacity 
        style={styles.placeOrderButton}
        onPress={placeOrder}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
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
    textAlign: 'center',
    marginVertical: 16,
  },
  section: {
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentLabel: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  radioButtonOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF',
  },
  placeOrderButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 24,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
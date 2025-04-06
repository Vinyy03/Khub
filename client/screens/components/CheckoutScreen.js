import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { RadioButton } from 'react-native-paper';

const CheckoutScreen = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');

  const receiptItems = [
    { id: '1', name: 'Grilled Chicken', quantity: 2, price: 15.99 },
    { id: '2', name: 'Beef Burger', quantity: 1, price: 10.99 },
    { id: '3', name: 'Coke', quantity: 3, price: 2.5 },
  ];

  const calculateTotal = () => {
    return receiptItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const paymentMethods = [
    { id: 'credit_card', label: 'Credit Card' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'cash', label: 'Cash' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>

      {/* Receipt Section */}
      <View style={styles.receiptContainer}>
        <Text style={styles.sectionHeader}>Receipt</Text>
        <FlatList
          data={receiptItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.receiptItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>
                {item.quantity} x ${item.price.toFixed(2)}
              </Text>
            </View>
          )}
        />
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>${calculateTotal()}</Text>
        </View>
      </View>

      {/* Payment Method Section */}
      <View style={styles.paymentContainer}>
        <Text style={styles.sectionHeader}>Payment Method</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={styles.paymentOption}
            onPress={() => setSelectedPaymentMethod(method.id)}
          >
            <RadioButton
              value={method.id}
              status={selectedPaymentMethod === method.id ? 'checked' : 'unchecked'}
              onPress={() => setSelectedPaymentMethod(method.id)}
            />
            <Text style={styles.paymentLabel}>{method.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  receiptContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
  },
  itemDetails: {
    fontSize: 16,
    color: '#555',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  paymentContainer: {
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
import React, { useEffect } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CartProvider } from './screens/context/CartContext';
import { Provider } from 'react-redux'; // Add this
import store from './redux/store'; // Add this
import { checkAuthStatus } from './redux/slices/authSlice'; // Add this

// Regular user screens
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegistrationScreen from './screens/auth/RegistrationScreen';
import CartScreen from './screens/components/CartScreen'; // Import CartScreen
import OrderHistory from './screens/OrderHistory';
import ReviewScreen from './screens/Review';
import ProductDetailScreen from './screens/components/ProductDetailScreen'; // Import ProductDetailScreen

// Admin screens
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import AdminUsersScreen from './screens/admin/AdminUsersScreen';
import AdminProductsScreen from './screens/admin/AdminProductsScreen';
import AdminOrdersScreen from './screens/admin/AdminOrdersScreen';
import AdminStocksScreen from './screens/admin/AdminStocksScreen';
import AdminCategoriesScreen from './screens/admin/AdminCategoriesScreen';

import 'react-native-gesture-handler';
import 'react-native-reanimated';

const Drawer = createDrawerNavigator();
const AdminDrawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Regular user drawer content
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.logoutButtonContainer}>
        <Button
          title="Logout"
          onPress={() => {
            props.navigation.navigate('Login');
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

// Admin drawer content
function AdminDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.adminHeader}>
        <Text style={styles.adminTitle}>Admin Panel</Text>
      </View>
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.logoutButtonContainer}>
        <Button 
          title="Logout" 
          onPress={() => {
            props.navigation.navigate('Login');
          }} 
        />
      </View>
    </DrawerContentScrollView>
  );
}

// Regular user drawer navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',
          width: 240,
        },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Order History" component={OrderHistory} />
      <Drawer.Screen name="Reviews" component={ReviewScreen} />
      <Drawer.Screen name="Cart" component={CartScreen} />
    </Drawer.Navigator>
  );
}

// Admin drawer navigator
function AdminDrawerNavigator() {
  return (
    <AdminDrawer.Navigator
      drawerContent={(props) => <AdminDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#f8f9fa',
          width: 240,
        },
        headerStyle: {
          backgroundColor: '#343a40',
        },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#007BFF',
      }}
    >
      <AdminDrawer.Screen name="Dashboard" component={AdminDashboardScreen} />
      <AdminDrawer.Screen name="Products" component={AdminProductsScreen} />
      <AdminDrawer.Screen name="Orders" component={AdminOrdersScreen} />
      <AdminDrawer.Screen name="Categories" component={AdminCategoriesScreen} />
    </AdminDrawer.Navigator>
  );
}

// Add a new component to handle initial loading and token checking
const AppContent = () => {
  useEffect(() => {
    // Check for existing auth token when app starts
    store.dispatch(checkAuthStatus());
  }, []);

  return (
    <CartProvider> {/* Keep your CartProvider */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {/* All your screens remain the same */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
          name="Register"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminPanel"
          component={AdminDrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={({ route }) => ({ title: route.params.product.name })}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: 'Your Cart' }}
        />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  logoutButtonContainer: {
    paddingHorizontal: 10,
    marginBottom: 50,
  },
  adminHeader: {
    padding: 20,
    backgroundColor: '#343a40',
  },
  adminTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
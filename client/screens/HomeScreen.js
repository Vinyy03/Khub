import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import Slider from '@react-native-community/slider'; // Import Slider component
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../screens/context/CartContext';
import { fetchProducts } from '../redux/slices/productSlice';
import { fetchCategories } from '../redux/slices/categorySlice';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { products, isLoading: productsLoading } = useSelector(state => state.products);
  const { categories, isLoading: categoriesLoading } = useSelector(state => state.categories);
  const { cartItems } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]); // State for price range [min, max]
  
  // Load products and categories when component mounts
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Filter products based on search, selected category, and price range
  const filteredProducts = products.filter(product => {
    const isSearchNumeric = !isNaN(searchQuery) && searchQuery.trim() !== ''; // Check if searchQuery is a number
    const isSearchCategory = categories.some(category => 
      category.name.toLowerCase() === searchQuery.toLowerCase()
    ); // Check if searchQuery matches a category name
  
    const matchesSearch = isSearchNumeric
      ? product.price === parseFloat(searchQuery) // Filter by price if searchQuery is a number
      : isSearchCategory
        ? product.categories && product.categories.includes(searchQuery) // Filter by category if searchQuery matches a category name
        : product.name.toLowerCase().includes(searchQuery.toLowerCase()); // Otherwise, filter by name
  
    const matchesCategory = selectedCategory 
      ? product.categories && product.categories.includes(selectedCategory)
      : true;
  
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
  
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  // Handle category selection
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
  };
  
  // Navigate to product detail screen
  const navigateToProductDetail = (product) => {
    navigation.navigate('ProductDetail', { productId: product._id });
  };
  
  return (
    <View style={styles.container}>
      {/* Header with Cart Button */}
      <View style={styles.header}>
        <Text style={styles.title}>KGrill Hub</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartButtonText}>Cart ({cartItems.length})</Text>
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      {/* Price Range Slider */}
      <View style={styles.priceRangeContainer}>
        <Text style={styles.priceRangeLabel}>
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1000}
          step={10}
          value={priceRange[1]}
          onValueChange={(value) => setPriceRange([priceRange[0], value])}
          minimumTrackTintColor="#007BFF"
          maximumTrackTintColor="#ddd"
        />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={priceRange[1]}
          step={10}
          value={priceRange[0]}
          onValueChange={(value) => setPriceRange([value, priceRange[1]])}
          minimumTrackTintColor="#007BFF"
          maximumTrackTintColor="#ddd"
        />
      </View>
      
      {/* Categories Horizontal List */}
      {categoriesLoading ? (
        <ActivityIndicator size="small" color="#007BFF" style={styles.loadingIndicator} />
      ) : (
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollView}
          >
            <TouchableOpacity
              style={[
                styles.categoryItem,
                !selectedCategory && styles.selectedCategoryItem
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text 
                style={[
                  styles.categoryText,
                  !selectedCategory && styles.selectedCategoryText
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            
            {categories.map(category => (
              <TouchableOpacity
                key={category._id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.name && styles.selectedCategoryItem
                ]}
                onPress={() => handleCategorySelect(category.name)}
              >
                <Text 
                  style={[
                    styles.categoryText,
                    selectedCategory === category.name && styles.selectedCategoryText
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      
      {/* Products Grid */}
      {productsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productItem}
              onPress={() => navigateToProductDetail(item)}
            >
              <Image 
                source={{ uri: item.image }} 
                style={styles.productImage}
                defaultSource={require('./../assets/placeholder.jpg')}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          )}
          numColumns={2}
          contentContainerStyle={styles.productsGrid}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory || priceRange
                ? 'No products found. Try a different search, category, or price range.'
                : 'No products available.'}
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cartButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchBar: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 15,
  },
  priceRangeContainer: {
    marginBottom: 15,
  },
  priceRangeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoriesScrollView: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  categoryItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCategoryItem: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  categoryText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  loadingIndicator: {
    marginVertical: 10,
  },
  productsGrid: {
    paddingBottom: 20,
  },
  productItem: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#28a745',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
    fontSize: 16,
  },
});

export default HomeScreen;
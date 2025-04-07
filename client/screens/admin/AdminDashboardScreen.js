import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const AdminDashboardScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>45</Text>
          <Text style={styles.statTitle}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statTitle}>Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>32</Text>
          <Text style={styles.statTitle}>Products</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Users")}
        >
          <Text style={styles.menuItemText}>Manage Users</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Products")}
        >
          <Text style={styles.menuItemText}>Manage Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Orders")}
        >
          <Text style={styles.menuItemText}>Manage Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Categories")}
        >
          <Text style={styles.menuItemText}>Manage Categories</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007BFF",
  },
  statTitle: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 15,
  },
  menuContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 10,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemText: {
    fontSize: 16,
    color: "#495057",
  },
});

export default AdminDashboardScreen;

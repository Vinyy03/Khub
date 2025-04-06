import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  TextInput, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, updateUserProfile, clearError } from '../redux/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  // State for user data
  const [userData, setUserData] = useState({
    username: user?.username || 'User',
    email: user?.email || 'email@example.com',
    address: user?.address || '',
    phone: user?.phone || '',
    country: user?.country || '',
  });

  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State to track if user wants to change password
  const [changingPassword, setChangingPassword] = useState(false);

  // Handle error messages
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form if canceling edit
      setUserData({
        username: user?.username || 'User',
        email: user?.email || 'email@example.com',
        address: user?.address || '',
        phone: user?.phone || '',
        country: user?.country || '',
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setChangingPassword(false);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const togglePasswordChange = () => {
    setChangingPassword(!changingPassword);
    if (!changingPassword) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  const validateData = () => {
    if (!userData.username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return false;
    }

    if (changingPassword) {
      if (!passwordData.currentPassword) {
        Alert.alert('Error', 'Current password is required');
        return false;
      }

      if (!passwordData.newPassword) {
        Alert.alert('Error', 'New password is required');
        return false;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        Alert.alert('Error', 'New passwords do not match');
        return false;
      }

      if (passwordData.newPassword.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return false;
      }
    }

    return true;
  };

  const saveChanges = () => {
    if (!validateData()) return;

    const updateData = {
      username: userData.username,
      address: userData.address,
      phone: userData.phone,
      country: userData.country,
    };

    // Add password data if changing password
    if (changingPassword) {
      updateData.currentPassword = passwordData.currentPassword;
      updateData.newPassword = passwordData.newPassword;
    }

    dispatch(updateUserProfile(updateData))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        setChangingPassword(false);
        Alert.alert('Success', 'Profile updated successfully');
      })
      .catch(() => {
        // Error is handled by the useEffect
      });
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {
            dispatch(logoutUser())
              .then(() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              });
          }
        }
      ]
    );
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need access to your photos to update your profile picture.');
        return;
      }
      
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled) {
        setUserData({
          ...userData,
          profileImage: result.assets[0].uri,
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Account</Text>
        </View>

        {/* Profile Fields */}
        <View style={styles.fieldsContainer}>
          {/* Regular fields */}
          {Object.keys(userData).map((field) => (
            <View key={field} style={styles.field}>
              <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
              {isEditing && field !== 'email' ? (
                <TextInput
                  style={styles.input}
                  value={userData[field]}
                  onChangeText={(value) => handleInputChange(field, value)}
                  editable={field !== 'email'} // Email is typically not editable
                />
              ) : (
                <Text style={styles.value}>{userData[field]}</Text>
              )}
            </View>
          ))}

          {/* Password change section */}
          {isEditing && (
            <View style={styles.passwordSection}>
              <TouchableOpacity onPress={togglePasswordChange} style={styles.passwordToggle}>
                <Text style={styles.passwordToggleText}>
                  {changingPassword ? '- Cancel Password Change' : '+ Change Password'}
                </Text>
              </TouchableOpacity>

              {changingPassword && (
                <>
                  <View style={styles.field}>
                    <Text style={styles.label}>Current Password</Text>
                    <TextInput
                      style={styles.input}
                      value={passwordData.currentPassword}
                      onChangeText={(value) => handlePasswordInputChange('currentPassword', value)}
                      secureTextEntry
                      placeholder="Enter current password"
                    />
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                      style={styles.input}
                      value={passwordData.newPassword}
                      onChangeText={(value) => handlePasswordInputChange('newPassword', value)}
                      secureTextEntry
                      placeholder="Enter new password"
                    />
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>Confirm New Password</Text>
                    <TextInput
                      style={styles.input}
                      value={passwordData.confirmPassword}
                      onChangeText={(value) => handlePasswordInputChange('confirmPassword', value)}
                      secureTextEntry
                      placeholder="Confirm new password"
                    />
                  </View>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity 
  onPress={isEditing ? pickImage : null} 
  disabled={!isEditing}
  style={[styles.profileImageContainer, isEditing && styles.profileImageContainerEditing]}
>
  <Image
    source={
      userData.profileImage
        ? { uri: userData.profileImage }
        : user?.profileImage
        ? { uri: user.profileImage }
        : require('../assets/placeholder.jpg')
    }
    style={styles.profileImage}
  />
  {isEditing && (
    <View style={styles.editImageOverlay}>
      <MaterialIcons name="camera-alt" size={24} color="#fff" />
    </View>
  )}
</TouchableOpacity>

      {/* Buttons at the Bottom */}
      <View style={styles.buttonsContainer}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveChanges}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={toggleEditMode}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  fieldsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  passwordSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  passwordToggle: {
    marginBottom: 15,
  },
  passwordToggleText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#FF4D4D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileImageContainerEditing: {
    opacity: 0.8,
  },
  editImageOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
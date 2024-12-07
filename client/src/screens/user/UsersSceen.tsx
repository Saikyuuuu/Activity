import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Alert,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../../utils/api"; // Import your centralized API instance
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const UsersScreen = () => {
  const [users, setUsers] = useState<any[]>([]); // Store users here
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const navigation = useNavigation();

  // Fetch all users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/auth/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: any) => {
    setCurrentUser(user);
    setEditedUsername(user.username);
    setEditedEmail(user.email);
    setIsModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editedUsername || !editedEmail) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      await api.put(`/auth/users/${currentUser.id}`, {
        username: editedUsername,
        email: editedEmail,
      });
      Alert.alert("Success", "User updated successfully.");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === currentUser.id
            ? { ...user, username: editedUsername, email: editedEmail }
            : user
        )
      );
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "Failed to update user.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (userId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              await api.delete(`/auth/users/${userId}`);
              Alert.alert("Success", "User deleted successfully.");
              setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== userId)
              );
            } catch (error) {
              console.error("Error deleting user:", error);
              Alert.alert("Error", "Failed to delete user.");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View className="flex-1">
      {isLoading && (
        <View className="absolute z-50 h-full w-full justify-center items-center">
          <View className="h-full w-full justify-center items-center bg-black opacity-[0.45]"></View>
          <View className="absolute">
            <ActivityIndicator size="large" color="white" />
          </View>
        </View>
      )}

      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row justify-start items-center px-4 py-4">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-2"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-lg font-bold">Users</Text>
        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="p-4 border-b flex-row items-center justify-between">
              {/* User Details */}
              <View className="flex-1">
                <Text className="text-xl font-semibold">{item.username}</Text>
                <Text className="text-sm text-neutral-500">{item.email}</Text>
              </View>

              {/* Buttons */}
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  className="bg-blue-500 py-2 px-4 rounded"
                >
                  <Text className="text-white font-bold">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  className="bg-red-500 py-2 px-4 rounded"
                >
                  <Text className="text-white font-bold">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </SafeAreaView>

      {/* Edit User Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center">
          {/* Background Blur */}
          <BlurView
            intensity={50}
            tint="dark"
            className="absolute h-full w-full"
          />

          {/* Modal Content */}
          <View className="bg-white w-[90%] rounded-lg p-6">
            <Text className="text-lg font-bold mb-4">Edit User</Text>
            <TextInput
              className="border p-2 mb-4 rounded"
              placeholder="Username"
              value={editedUsername}
              onChangeText={setEditedUsername}
            />
            <TextInput
              className="border p-2 mb-4 rounded"
              placeholder="Email"
              value={editedEmail}
              onChangeText={setEditedEmail}
            />
            <View className="flex-row justify-between">
              <Button
                title="Cancel"
                onPress={() => setIsModalVisible(false)}
                color="gray"
              />
              <Button title="Save" onPress={handleSaveEdit} color="blue" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UsersScreen;

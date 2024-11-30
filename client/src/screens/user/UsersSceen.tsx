import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const UsersScreen = () => {
  const [users, setUsers] = useState<any[]>([]); // Store users here
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://192.168.254.106:5000/auth/users");
      const data = await response.json();
      setUsers(data.users); // Assuming the response has a 'users' field
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
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
        <View className="flex-row justify-start gap-20 items-center px-4 py-4">
          <View className="border-2 border-neutral-500 rounded-full p-1">
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color="gray"
              onPress={() => navigation.goBack()}
            />
          </View>
          <Text className="text-lg font-bold">Users Details</Text>
        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()} // Assuming users have an 'id'
          renderItem={({ item }) => (
            <View className="p-2">
              <View className="p-4 border-b">
                <Text className="text-xl font-semibold">
                  Username: {item.username}
                </Text>
                <Text className="text-sm text-neutral-500">
                  Email: {item.email}
                </Text>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

export default UsersScreen;

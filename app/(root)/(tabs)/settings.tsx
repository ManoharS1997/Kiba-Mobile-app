import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";
import { useAuth } from "@/context/AuthContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = () => {
  const router = useRouter();
  const { auth, setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedOut, setIsSignedOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("tokenExpiry");
    setAuth({ token: null, name: null, email: null });
    setIsSignedOut(true);
  };

  useEffect(() => {
    if (isSignedOut && auth.token === null) {
      router.replace("/");
    }
  }, [isSignedOut, auth]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center w-full h-full bg-white">
        <ActivityIndicator size="large" className="text-black" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#e9ecef] h-screen w-full">
      <StatusBar backgroundColor="#e9ecef" barStyle="dark-content" />
      <View className="bg-[#e9ecef] h-full w-full">
        <View
          className="flex-row items-center justify-between w-full py-2.5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 1,
            elevation: 2,
            backgroundColor: "#1b98e0",
            borderBottomWidth: 1,
            borderBottomColor: "#e0e0e0",
          }}
        >
          <Text className="text-2xl text-white font-semibold text-center flex-1">
            Profile
          </Text>
        </View>

        <View className="p-5 w-full h-full flex justify-center items-between flex-col">
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="w-full space-y-6"
          >
            <View className="flex flex-col justify-center items-center gap-5 mt-10">
              <View className="w-[5rem] bg-teal-400 h-[5rem] flex justify-center items-center rounded-full">
                <Text className="text-[3.2rem] text-white ">
                  {auth.name ? auth.name[0] : "?"}
                </Text>
              </View>
              <Text className="text-3xl font-semibold">
                {auth.name || "Unknown User"}
              </Text>
              <View className="flex justify-center items-center flex-row gap-2.5">
                <Image source={icons.google} className="w-4 h-4" />
                <Text className="text-xl font-light">{auth.email}</Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            onPress={handleSignOut}
            className="mb-[10rem] flex justify-center items-center w-full flex-row gap-2.5"
          >
            <Text className="text-2xl font-semibold text-[#2665D6]">
              Sign Out
            </Text>
            <MaterialIcons name="logout" size={24} color="#2665D6" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

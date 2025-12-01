import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const checkTokenValidity = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const expiry = await AsyncStorage.getItem("tokenExpiry");
    if (!token || !expiry) {
      return false;
    }
    const currentTime = new Date().getTime();
    if (currentTime > parseInt(expiry)) {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("tokenExpiry");
      return false;
    }
    return true;
  } catch (error: any) {
    Alert.alert(
      error?.response?.data?.message ||
        error?.message ||
        "Error while checking token"
    );
    return false;
  }
};

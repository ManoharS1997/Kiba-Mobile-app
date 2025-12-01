import images from "@/constants/images";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { baseUrl } from "@/config/Index";
import moment from "moment-timezone";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginOne = () => {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [executive_id, setExecutive_id] = useState("");
  const [password, setPassword] = useState("");
  const [isExecutiveId, setIsExecutiveId] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isPassword || isExecutiveId) {
      const timeout = setTimeout(() => {
        setIsPassword(false);
        setIsExecutiveId(false);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [isPassword, isExecutiveId]);

  const storeTheDeviceInfo = async (deviceId: string) => {
    try {
      const localTime = moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DDTHH:mm:ss.SSS");
      await fetch(`${baseUrl}/device/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_unique_id: deviceId, time: localTime }),
      });
    } catch (error: any) {
      Alert.alert(
        error?.response?.data?.message || error?.message || "Device Info Error"
      );
    }
  };

  const storeToken = async (token: string, expiresIn: number) => {
    try {
      const expiryTime = new Date().getTime() + expiresIn * 1000;
      await AsyncStorage.setItem("accessToken", token);
      await AsyncStorage.setItem("tokenExpiry", expiryTime.toString());
    } catch (error: any) {
      Alert.alert(error?.response?.data.message || "Error while token storage");
    }
  };

  const handleLogin = async () => {
    if (!executive_id.trim() || !password.trim()) {
      Alert.alert(
        "Missing Fields",
        "Please enter both Executive ID and Password."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/admin/executive-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          executive_id: executive_id?.toLocaleLowerCase(),
          password,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAuth({
          token: data.accessToken,
          name: data.data.name,
          email: data.data.email,
        });

        await Promise.all([
          AsyncStorage.setItem("name", data.data.name),
          AsyncStorage.setItem("email", data.data.email),
          storeToken(data.accessToken, 7 * 24 * 60 * 60),
          storeTheDeviceInfo(Device?.osInternalBuildId ?? ""),
        ]);

        router.push("/customerAccount");
      } else {
        data.message === "Incorrect password"
          ? setIsPassword(true)
          : setIsExecutiveId(true);
      }
    } catch (error) {
      Alert.alert("Login Failed", "Unable to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={images.loginImg}
      style={{ flex: 1 }}
      resizeMode="cover"
      blurRadius={Platform.OS === "ios" ? 8 : 6}
    >
      <LinearGradient
        colors={[
          "rgba(27, 152, 224, 0.2)",
          "rgba(12, 76, 161, 0.4)",
          "rgba(8, 49, 108, 0.6)",
        ]}
        style={{ flex: 1, paddingHorizontal: 24, justifyContent: "center" }}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" />
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1, justifyContent: "center" }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 32,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                width: "100%",
                maxWidth: 420,
                borderRadius: 24,
                paddingVertical: 40,
                paddingHorizontal: 28,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 12,
              }}
            >
              {/* Logo */}
              <View
                style={{
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Image
                  source={images.icon}
                  style={{ width: 130, height: 100, borderRadius: 20 }}
                  resizeMode="contain"
                />
              </View>

              {/* Welcome Text */}
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: "#1B98E0",
                  marginBottom: 24,
                  textAlign: "center",
                  letterSpacing: 0.5,
                }}
              >
                Welcome Back!
              </Text>

              {/* Executive ID Input */}
              <TextInput
                placeholder="Executive ID*"
                placeholderTextColor="#8A9BB8"
                value={executive_id}
                onChangeText={setExecutive_id}
                style={{
                  height: Platform.OS === "ios" ? 52 : 45,
                  backgroundColor: "#F7F9FC",
                  borderRadius: 14,
                  paddingHorizontal: 18,
                  fontSize: 16,
                  color: "#222",
                  marginBottom: isExecutiveId ? 6 : 18,
                  borderWidth: isExecutiveId ? 1.8 : 1,
                  borderColor: isExecutiveId ? "#E55353" : "#CED4DA",
                  shadowColor: isExecutiveId ? "#E55353" : "#000",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: isExecutiveId ? 0.3 : 0,
                  shadowRadius: 4,
                }}
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType="next"
              />
              {isExecutiveId && (
                <Text
                  style={{
                    color: "#E55353",
                    fontSize: 12,
                    marginBottom: 14,
                    fontWeight: "600",
                  }}
                >
                  Invalid Executive ID
                </Text>
              )}

              {/* Password Input with visibility toggle */}
              <View
                style={{
                  position: "relative",
                  marginBottom: isPassword ? 6 : 18,
                }}
              >
                <TextInput
                  placeholder="Password*"
                  placeholderTextColor="#8A9BB8"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                  style={{
                    height: Platform.OS === "ios" ? 52 : 45,
                    backgroundColor: "#F7F9FC",
                    borderRadius: 14,
                    paddingHorizontal: 18,
                    fontSize: 16,
                    color: "#222",
                    borderWidth: isPassword ? 1.8 : 1,
                    borderColor: isPassword ? "#E55353" : "#CED4DA",
                    shadowColor: isPassword ? "#E55353" : "#000",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: isPassword ? 0.3 : 0,
                    shadowRadius: 4,
                    paddingRight: 48,
                  }}
                  autoCapitalize="none"
                  returnKeyType="done"
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: [{ translateY: -15 }],
                    padding: 4,
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={passwordVisible ? "eye" : "eye-off"}
                    size={24}
                    color="#8A9BB8"
                  />
                </TouchableOpacity>
              </View>
              {isPassword && (
                <Text
                  style={{
                    color: "#E55353",
                    fontSize: 12,
                    marginBottom: 20,
                    fontWeight: "600",
                  }}
                >
                  Incorrect Password
                </Text>
              )}

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.85}
                style={{
                  backgroundColor: "#1B98E0",
                  paddingVertical: Platform.OS === "ios" ? 16 : 10,
                  borderRadius: 14,
                  elevation: 6,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                {isLoading && (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 12 }}
                  />
                )}
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "700",
                    letterSpacing: 0.6,
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

export default LoginOne;

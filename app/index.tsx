import { View, ActivityIndicator } from "react-native";
import LoginOne from "@/components/LoginOne";
import { checkTokenValidity } from "@/config/checkTokenValidity";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const { setAuth } = useAuth();
  const router = useRouter();
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const validateToken = async () => {
      const isValid = await checkTokenValidity();
      if (isValid) {
        const [token, name, email] = await Promise.all([
          AsyncStorage.getItem("accessToken"),
          AsyncStorage.getItem("name"),
          AsyncStorage.getItem("email"),
        ]);

        if (isMounted) {
          setAuth({ token, name, email });
          router.replace("/customerAccount");
        }
      } else if (isMounted) {
        setCheckingToken(false);
      }
    };

    validateToken();

    return () => {
      isMounted = false;
    };
  }, []);

  if (checkingToken) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return <LoginOne />;
}

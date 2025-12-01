import {
  SafeAreaView,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { baseUrl } from "@/config/Index";
import FullImageModal from "@/components/FullImageModal";
import icons, { cultivations } from "@/constants/icons";

type Customer = {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNumber: number;
  whatsappNumber: number;
  cultivation: string;
  state: string;
  city: string;
  district?: string; // optional
  pincode: number;
  place: string;
  notes: string;
  customer: boolean;
  trailPack?: boolean; // optional
  ownLand?: boolean; // optional
  image?: string;
  additionalImages?: string[]; // specify type
};

const CustomerAccount = () => {
  const router = useRouter();
  const { auth } = useAuth();
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [customerData, setCustomerData] = useState<Customer | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!auth.token) {
      router.push("/");
    }
  }, [auth.token]);

  const handleBackPress = () => {
    router.back();
  };

  const getCustomerDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/customer/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        }
      });

      const data: Customer = await response.json();
      setCustomerData(data);
    } catch (error: any) {
      Alert.alert(
        error?.response?.data?.message ||
          error?.message ||
          "Error fetching customer data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.token && id) {
      getCustomerDetails();
    }
  }, [auth.token, id]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#e9ecef] h-screen w-full">
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
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
            borderBottomColor: "#e0e0e0"
          }}
        >
          <TouchableOpacity
            onPress={handleBackPress}
            className="absolute top-2.5 left-2 z-50 "
          >
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl text-white font-semibold text-center flex-1">
            Customer Details
          </Text>
        </View>

        <View className="p-5 w-full">
          {customerData?.image ? (
            <Image
              source={{ uri: customerData?.image }}
              className="w-24 h-24 rounded-full mx-auto my-2.5"
              resizeMode="cover"
            />
          ) : (
            <View className=" w-24 h-24 mx-auto my-2.5 bg-white p-[8px] border border-black/20 rounded-full overflow-hidden">
              <Image
                source={icons?.farmer}
                className="w-full h-full "
                resizeMode="contain"
              />
            </View>
          )}

          <ScrollView
            showsVerticalScrollIndicator={false}
            className="w-full h-[80vh]"
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View className="flex-col justify-between items-center gap-2.5">
              <View className="flex flex-row justify-between items-center w-full">
                <View className="w-[48%]">
                  <Text className="mb-1">First Name</Text>
                  <TextInput
                    className="w-full h-[3rem] bg-white rounded-xl px-2"
                    placeholder="First Name"
                    value={customerData?.firstName}
                    editable={false}
                    placeholderTextColor={"#6F7789"}
                  />
                </View>
                <View className="w-[48%]">
                  <Text className="mb-1">Last Name</Text>
                  <TextInput
                    className="w-full h-[3rem] bg-white rounded-xl px-2"
                    placeholder="Last Name"
                    value={customerData?.lastName}
                    editable={false}
                    placeholderTextColor={"#6F7789"}
                  />
                </View>
              </View>

              {/* Mobile Number */}
              <View className="flex flex-row justify-between items-center w-full">
                <View className="w-[48%]">
                  <Text className="mb-1">Mobile Number</Text>
                  <TextInput
                    className="w-full h-[3rem] bg-white  rounded-xl px-2"
                    placeholder="Mobile Number"
                    value={customerData?.mobileNumber?.toString()}
                    editable={false}
                    placeholderTextColor={"#6F7789"}
                  />
                </View>
                {/* WhatsApp Number */}

                <View className="w-[48%]">
                  <Text className="mb-1">Whatsapp Number</Text>
                  <TextInput
                    className="w-full h-[3rem] bg-white  rounded-xl px-2"
                    placeholder="WhatsApp Number"
                    value={customerData?.whatsappNumber?.toString()}
                    editable={false}
                    placeholderTextColor={"#6F7789"}
                  />
                </View>
              </View>

              {/* Product */}
              <View className="w-full">
                <Text className="mb-1">Cultivation</Text>
                <TextInput
                  className="w-full h-[3rem] bg-white  rounded-xl px-2"
                  placeholder="Product"
                  value={customerData?.cultivation}
                  editable={false}
                  placeholderTextColor={"#6F7789"}
                />
              </View>

              {/* postal code and place */}
              <View className="flex flex-row justify-between items-center w-full">
                <View className="w-[48%]">
                  <Text className="mb-1">Postal Code</Text>
                  <TextInput
                    className="w-full h-[3rem] bg-white  rounded-xl px-2"
                    placeholder="Postal Code"
                    value={customerData?.pincode?.toString()}
                    editable={false}
                    placeholderTextColor={"#6F7789"}
                  />
                </View>
                <View className="w-[48%]">
                  <Text className="mb-1">Place</Text>
                  <TextInput
                    className="w-full h-[3rem] bg-white  rounded-xl px-2"
                    placeholder="City"
                    value={customerData?.place}
                    editable={false}
                    placeholderTextColor={"#6F7789"}
                  />
                </View>
              </View>

              {/* District and State */}
              <View className="flex flex-row justify-between items-center w-full">
                <View className="w-[48%]">
                  <Text className="mb-1">District</Text>
                  <TextInput
                    className="w-full h-[3rem] bg-white  rounded-xl px-2"
                    placeholder="City"
                    value={customerData?.district}
                    editable={false}
                    placeholderTextColor={"#6F7789"}
                  />
                </View>
                <View className="w-[48%]">
                  <Text className="mb-1">Postal Code</Text>
                  <TextInput
                    className="w-full h-[3rem] bg-white  rounded-xl px-2"
                    placeholder="Postal Code"
                    value={customerData?.state}
                    editable={false}
                    placeholderTextColor={"#6F7789"}
                  />
                </View>
              </View>

              {/* Notes */}
              <View className="w-full">
                <Text className="mb-1">Notes</Text>
                <TextInput
                  className="w-full h-24 bg-white rounded-xl p-2"
                  placeholder="Notes"
                  value={customerData?.notes}
                  editable={false}
                  textAlignVertical="top"
                  multiline={true} // Enable multiple lines
                  numberOfLines={4}
                  placeholderTextColor={"#6F7789"}
                />
              </View>

              {/* Customer Yes/No */}
              <View className="w-full flex flex-row justify-between items-center">
                <Text className="text-xl">Sample Recieved ? Yes / No?</Text>
                <Text
                  className={`text-xl font-bold ${
                    customerData?.trailPack ? "text-green-600" : "text-red-600"
                  } `}
                >
                  {customerData?.trailPack ? "Yes" : "No"}
                </Text>
              </View>

              <View className="w-full flex flex-row justify-between items-center">
                <Text className="text-xl">Existing Customer ? Yes / No?</Text>
                <Text
                  className={`text-xl font-bold ${
                    customerData?.customer ? "text-green-600" : "text-red-600"
                  } `}
                >
                  {customerData?.customer ? "Yes" : "No"}
                </Text>
              </View>

              <View className="w-full flex flex-row justify-between items-center">
                <Text className="text-xl">Own Land ? Yes / No?</Text>
                <Text
                  className={`text-xl font-bold ${
                    customerData?.ownLand ? "text-green-600" : "text-red-600"
                  } `}
                >
                  {customerData?.ownLand ? "Yes" : "No"}
                </Text>
              </View>

              {/* Additional Images */}
              <View className="w-full flex flex-col">
                {customerData?.additionalImages &&
                  customerData.additionalImages.length > 0 && (
                    <>
                      <Text className="text-xl font-semibold mb-2">
                        Additional Images
                      </Text>
                      <View className="flex flex-row justify-start items-center gap-5">
                        {customerData.additionalImages
                          .slice(0, 4)
                          .map((image, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => {
                                setSelectedImage(image);
                                setModalVisible(true);
                              }}
                            >
                              <Image
                                source={{ uri: image }}
                                className="w-20 h-20 rounded-lg"
                                resizeMode="cover"
                              />
                            </TouchableOpacity>
                          ))}
                      </View>
                    </>
                  )}

                {/* Full Image Modal */}
                <FullImageModal
                  visible={modalVisible}
                  imageUri={selectedImage}
                  onClose={() => setModalVisible(false)}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomerAccount;

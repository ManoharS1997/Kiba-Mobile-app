import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import Search from "@/components/Search";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import icons, { cultivations } from "@/constants/icons";
import NoResults from "@/components/NoResults";
import { baseUrl } from "@/config/Index";

type Customer = {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNumber?: number;
  whatsappNumber?: number;
  city?: string;
  state?: string;
  pincode?: string;
  image?: string;
  additionalImages?: string[];
  cultivation: string;
};

const CustomerAccount = () => {
  const router = useRouter();
  const { auth } = useAuth();

  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [customersFilteredData, setCustomersFilteredData] = useState<
    Customer[]
  >([]);
  const [isLoading, setIsLoading] = useState(false); // initial load
  const [isFetchingMore, setIsFetchingMore] = useState(false); // pagination loader
  const [isFilter, setIsFilter] = useState(false);

  const [offset, setOffset] = useState(0);
  const [limit] = useState(20);
  const [hasMore, setHasMore] = useState(true);

  const getCustomers = async () => {
    if (isLoading || isFetchingMore || !hasMore) return;

    if (offset === 0) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      const response = await fetch(
        `${baseUrl}/customer/customer-list-web?offset=${offset}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`
          }
        }
      );

      const CustomerData = await response.json();
      const newCustomers: Customer[] = CustomerData.data;

      setCustomersData((prev) => [...prev, ...newCustomers]);
      setOffset((prev) => prev + newCustomers.length);

      if (newCustomers.length < limit) setHasMore(false);
    } catch (error: any) {
      Alert.alert(
        error?.response?.data?.message ||
          error?.message ||
          "Error fetching customer data"
      );
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const Item = ({
    image,
    firstName,
    lastName,
    city,
    cultivation
  }: Customer) => (
    <View className="bg-white p-4 my-1 rounded-2xl flex-row justify-between items-center shadow-md shadow-black/10">
      <View className="flex flex-col gap-2.5">
        <Text className="text-xl font-bold max-370:text-lg">
          {firstName} {lastName}
        </Text>
        <View className="flex flex-row gap-2.5 justify-start items-center">
          <Image source={icons.location} className="w-4 h-4" />
          <Text className="text-sm text-gray-600 capitalize">{city}</Text>
        </View>
        <View className="flex flex-row gap-2.5 justify-start items-center">
          <Image
            source={cultivations[cultivation] || ""}
            className="w-5 h-6"
            resizeMode="contain"
          />
          <Text className="text-sm text-gray-600 capitalize">
            {cultivation}
          </Text>
        </View>
      </View>
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-24 h-24 rounded-full border border-black/20"
          resizeMode="cover"
        />
      ) : (
        <View className="w-24 h-24 p-[8px] border border-black/20 rounded-full overflow-hidden">
          <Image
            source={icons?.farmer}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );

  if (isLoading && offset === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#e9ecef]">
        <ActivityIndicator size="large" color="#1b98e0" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#e9ecef] h-screen w-full">
      <StatusBar backgroundColor="#e9ecef" barStyle="dark-content" />
      <View className="bg-[#e9ecef] h-full w-full">
        <View className="flex flex-row justify-between items-center w-full p-5">
          <Search
            setIsFilter={setIsFilter}
            customersData={customersData}
            setCustomersFilteredData={setCustomersFilteredData}
          />
        </View>
        <View className="px-5 flex-1">
          <Text className="my-1 text-2xl font-semibold text-center">
            Customers
          </Text>
          <FlatList
            data={
              customersFilteredData.length > 0
                ? customersFilteredData
                : isFilter
                ? []
                : customersData
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/account/[id]",
                    params: { id: item._id }
                  })
                }
              >
                <Item
                  _id={item._id}
                  image={item.image}
                  firstName={item.firstName}
                  lastName={item.lastName}
                  city={item.city}
                  cultivation={item.cultivation}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
            onEndReached={getCustomers}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingMore ? (
                <ActivityIndicator
                  size="large"
                  color="#1b98e0"
                  className="mt-5"
                />
              ) : null
            }
            ListEmptyComponent={!isLoading ? <NoResults /> : null}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomerAccount;

import React, { useEffect, useState } from "react";
import { View, Image, TextInput, TouchableOpacity } from "react-native";
import icons from "@/constants/icons";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
type Customer = {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNumber?: number;
  whatsappNumber?: number;
  city?: string;
  state?: string;
  district?: string;
  pincode?: string;
  image?: string;
  additionalImages?: string[];
  cultivation: string;
  place?: string;
  notes?: string;
};
type setCustomersData = React.Dispatch<React.SetStateAction<Customer[]>>;
interface SearchProps {
  setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomersFilteredData: setCustomersData;
  customersData?: Customer[];
}

const Search: React.FC<SearchProps> = ({
  setIsFilter,
  customersData = [],
  setCustomersFilteredData,
}) => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [search, setSearch] = useState(params.query || "");

  useEffect(() => {
    if (!search.trim()) {
      setCustomersFilteredData(customersData);
      setIsFilter(false);
    }
  }, [customersData]);

  useEffect(() => {
    if (params.query) {
      handleSearch(params.query);
    }
  }, [params.query]);

  const handleSearch = (text: string) => {
    setSearch(text);

    if (!text.trim()) {
      setCustomersFilteredData(customersData);
      setIsFilter(false);
      return;
    }

    const lowerText = text.toLowerCase();
    const filtered = customersData.filter((customer) => {
      const fullName =
        `${customer.firstName} ${customer.lastName}`.toLowerCase();
      const mobile = customer.mobileNumber?.toString() || "";
      const whatsapp = customer.whatsappNumber?.toString() || "";
      const place = customer.place?.toLowerCase() || "";
      const city = customer.city?.toLowerCase() || "";
      const district = customer.district?.toLowerCase() || "";
      const state = customer.state?.toLowerCase() || "";
      const cultivation = customer.cultivation?.toLowerCase() || "";
      const notes = customer.notes?.toLowerCase() || "";
      const pincode = customer.pincode?.toString().toLowerCase() || "";
      return (
        fullName.includes(lowerText) ||
        mobile.includes(lowerText) ||
        whatsapp.includes(lowerText) ||
        place.includes(lowerText) ||
        district.includes(lowerText) ||
        state.includes(lowerText) ||
        cultivation.includes(lowerText) ||
        notes.includes(lowerText) ||
        pincode.includes(lowerText) ||
        city.includes(lowerText)
      );
    });

    setIsFilter(true);
    setCustomersFilteredData(filtered);
  };

  const handleClear = () => {
    setSearch("");
    setCustomersFilteredData(customersData);
    setIsFilter(false);
  };

  return (
    <View className="flex flex-row items-center justify-between px-4 w-full h-12 rounded-[4rem] bg-white">
      <View className="flex-1 flex flex-row items-center justify-start z-50">
        <Image source={icons.search} className="size-7" />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search"
          placeholderTextColor="#6F7789"
          className=" font-rubik text-black-300 ml-2 flex-1"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <MaterialIcons name="clear" size={22} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Search;

import React from "react";
import { Modal, View, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FullImageModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
}

const FullImageModal: React.FC<FullImageModalProps> = ({
  visible,
  imageUri,
  onClose
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View className="flex-1 bg-black/90 justify-center items-center">
        {/* Close Button */}
        <Pressable
          style={{
            position: "absolute",
            top: 40,
            right: 20,
            padding: 10 // Better tap area
          }}
          onPress={onClose}
        >
          <View className="bg-white rounded-full p-1">
            <Ionicons name="close" size={35} color="black" />
          </View>
        </Pressable>

        {/* Full Screen Image */}
        {imageUri && (
          <View
            style={{
              width: "90%",
              height: "70%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              shadowColor: "#000",
              padding: 5
            }}
          >
            <Image
              source={{ uri: imageUri }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 12
              }}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default FullImageModal;

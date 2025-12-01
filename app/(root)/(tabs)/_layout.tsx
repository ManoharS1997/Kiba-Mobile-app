// import { Tabs, useRouter } from "expo-router";
// import { Text } from "react-native";
// import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import { useAuth } from "@/context/AuthContext";
// import { useEffect } from "react";
// import { TouchableOpacity, View } from "react-native";

// const TabsLayout = () => {
//   const router = useRouter();
//   const { auth } = useAuth();
//   useEffect(() => {
//     if (!auth.token) {
//       router.push("/");
//     }
//   }, []);

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarStyle: {
//           backgroundColor: "#1b98e0",
//           borderTopColor: "#0061FF1A",
//           borderTopWidth: 1,
//           height: 55,
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="customerAccount"
//         options={{
//           tabBarLabel: () => null,
//           tabBarButton: (props) => {
//             const { onLongPress, delayLongPress, ...restProps } = props;
//             return (
//               <TouchableOpacity
//                 {...restProps}
//                 onLongPress={onLongPress ?? undefined}
//                 delayLongPress={delayLongPress ?? undefined}
//                 style={{
//                   flex: 1,
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               />
//             );
//           },
//           tabBarIcon: ({ focused }) => (
//             <FontAwesome
//               name="list-ul"
//               size={28}
//               color={focused ? "#bde0fe" : "white"}
//             />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="settings"
//         options={{
//           tabBarLabel: () => null,
//           tabBarButton: (props) => {
//             const { onLongPress, delayLongPress, ...restProps } = props;
//             return (
//               <TouchableOpacity
//                 {...restProps}
//                 onLongPress={onLongPress ?? undefined}
//                 delayLongPress={delayLongPress ?? undefined}
//                 style={{
//                   flex: 1,
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               />
//             );
//           },
//           tabBarIcon: ({ focused }) => (
//             <FontAwesome5
//               name="user"
//               size={28}
//               color={focused ? "#bde0fe" : "white"}

//             />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// };

// export default TabsLayout;

import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "@/context/AuthContext";

const TabsLayout = () => {
  const router = useRouter();
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth.token) {
      router.push("/");
    }
  }, []);

  const renderTabButton = (props: any) => {
    const {
      onLongPress,
      delayLongPress,
      accessibilityState,
      style,
      ...restProps
    } = props;
    const focused = accessibilityState?.selected ?? false;

    return (
      <TouchableOpacity
        {...restProps}
        onLongPress={onLongPress ?? undefined}
        delayLongPress={delayLongPress ?? undefined}
        style={[
          style,
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }
        ]}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: focused ? "#ccc" : "transparent" // background visible here
          }}
        >
          {props.children}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1b98e0",
          borderTopColor: "#0061FF1A",
          borderTopWidth: 1,
          flexDirection: "row",
          paddingTop:20,
          paddingBottom:40,
        }
      }}
    >
      <Tabs.Screen
        name="customerAccount"
        options={{
          tabBarButton: renderTabButton,
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="list-ul"
              size={28}
              color={focused ? "white" : "#bde0fe"}
            />
          )
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarButton: renderTabButton,
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="user"
              size={28}
              color={focused ? "white" : "#bde0fe"}
            />
          )
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

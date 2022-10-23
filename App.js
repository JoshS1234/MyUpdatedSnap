import { StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import AlbumStack from "./stacks/AlbumStack";
import CameraScreen from "./screens/CameraScreen";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MenuProvider } from "react-native-popup-menu";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const TabNav = () => {
    return (
      <Tab.Navigator screenOptions={{ headerShown: true }}>
        <Tab.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Entypo name="camera" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="My Albums"
          component={AlbumStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="photo-album" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          children={() => <Profile />}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

  return (
    <MenuProvider>
      <NavigationContainer style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={Login}
          />
          <Stack.Screen name="Home" component={TabNav}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import SignUp from "./SignUp";
import Login from "./Login";

const Layout: React.FC = () => {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter_18pt-Bold.ttf"),
    "Inter-ExtraBold": require("../assets/fonts/Inter_18pt-ExtraBold.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter_18pt-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <Stack initialRouteName="SignUp">
      <Stack.Screen name="SignUp" options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: false }} />
    </Stack>
    // <SignUp />
    // <Login />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Layout;

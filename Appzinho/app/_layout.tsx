import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#101010",
        },
        headerTintColor: "#FFD700",
        
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        headerTitleAlign: "center",
        
        headerShadowVisible: false,

        headerTitle: "Fitzinho",
      }}
    ></Stack>
  );
}
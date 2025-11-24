import { Pressable, Text, View, StyleSheet} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useState } from "react";
import { UserProfile } from "@/models/models";

export default function Index() {
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.card}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Seja bem-vindo ao Fitzinho!</Text>
          
          <Text style={styles.subtitle}>
            Para começar precisamos que você configure seu perfil!
          </Text>
          
          <Text style={styles.disclaimer}>
            Ao clicar em Começar, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </Text>
        </View>

        <Pressable 
          style={({ pressed }) => [
            styles.button, 
            pressed && styles.buttonPressed
          ]}
          onPress={() => router.push("/profile-setup")}
        >
          <Text style={styles.buttonText}>Começar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    padding: 24,
    
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,

    marginBottom: 100,
  },
  contentContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    color: "#FFD700",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    color: "#E0E0E0",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 75,
  },
  disclaimer: {
    color: "#888888",
    fontSize: 12,
    marginTop: 16,
    textAlign: "center",
    lineHeight: 18,
  },
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFD700", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }]
  },
  buttonText: {
    color: "#121212",
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
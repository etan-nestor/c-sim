import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

export default function Home() {
  const { name } = useLocalSearchParams<{ name: string }>();

  useEffect(() => {
    if (name) {
      Toast.show({
        type: "success",
        text1: `Bienvenue ${name} 🎵`,
        text2: "Heureux de te voir ici ✨",
        visibilityTime: 5000,
      });
    }
  }, [name]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue {name ?? "utilisateur"} 🎉</Text>
      <Text style={styles.subtitle}>Tu es maintenant connecté !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF4500",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    color: "gray",
  },
});

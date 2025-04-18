import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import useBackButtonExit from "@/hooks/useBackButtonExit";
import NavBar from "../components/NavBar";
import FooterTab from "../components/FooterTab";

export default function WithAccountLayout() {
  useBackButtonExit();
  return (
    <View style={styles.container}>
      <NavBar />
      <View style={styles.content}>
        <Slot />
      </View>
      <FooterTab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingBottom: 80, // Pour ne pas que le contenu passe sous le footer
    paddingTop: 60, // Pareil pour la navbar
  },
});

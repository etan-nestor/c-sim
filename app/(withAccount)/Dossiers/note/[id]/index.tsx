import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function NoteIndexScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"lesson" | "song" | null>(null);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const handleModalOpen = (type: "lesson" | "song") => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleRedirect = (action: "text" | "photo" | "scan" | "record") => {
    if (!modalType || !id) return;
  
    // Déterminer le chemin en fonction de l'action (photo, scan, record)
    const baseRoute = `/Dossiers/${modalType === "lesson" ? "lessons" : "songs"}`;
  
    let route;
    switch (action) {
      case "photo":
        route = `${baseRoute}/photo/${id}/edit`; // Redirige vers la page photo
        break;
      case "scan":
        route = `${baseRoute}/scan/${id}/edit`; // Redirige vers la page scan
        break;
      case "record":
        route = `${baseRoute}/record/${id}/edit`; // Redirige vers la page record
        break;
      case "text":
      default:
        route = `${baseRoute}/note/${id}/edit`; // Redirige vers la page texte
        break;
    }

    // Utilisation de router.push avec un chemin absolu
    router.push(route as any); // On force le type ici, assure-toi que c'est compatible avec ton projet
    setModalVisible(false); // Ferme le modal après redirection
  };
  

  const themeColor = modalType === "lesson" ? "#007AFF" : "#FF6B00";
  const titleText = modalType === "lesson" ? "Ajouter une Leçon" : "Ajouter un Chant";

  const iconMap: Record<"text" | "photo" | "scan" | "record", keyof typeof Feather.glyphMap> = {
    text: "edit",
    photo: "camera",
    scan: "file-text",
    record: "mic",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Une Lecon ou Une Chanson ? 🐱</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#007AFF" }]}
        onPress={() => handleModalOpen("lesson")}
      >
        <FontAwesome5 name="chalkboard-teacher" size={22} color="#fff" />
        <Text style={styles.buttonText}>Ajouter une Leçon</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#FF6B00" }]}
        onPress={() => handleModalOpen("song")}
      >
        <MaterialCommunityIcons name="music-circle" size={26} color="#fff" />
        <Text style={styles.buttonText}>Ajouter un Chant</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { borderColor: themeColor }]}>
            <Text style={[styles.modalTitle, { color: themeColor }]}>
              {titleText}
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: themeColor }]}
              onPress={() => handleRedirect("text")}
            >
              <Feather name={iconMap.text} size={22} color="#fff" />
              <Text style={styles.modalButtonText}>Saisir un texte</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: themeColor }]}
              onPress={() => handleRedirect("photo")}
            >
              <Feather name={iconMap.photo} size={22} color="#fff" />
              <Text style={styles.modalButtonText}>Prendre une photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: themeColor }]}
              onPress={() => handleRedirect("scan")}
            >
              <Feather name={iconMap.scan} size={22} color="#fff" />
              <Text style={styles.modalButtonText}>Scanner un document</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: themeColor }]}
              onPress={() => handleRedirect("record")}
            >
              <Feather name={iconMap.record} size={22} color="#fff" />
              <Text style={styles.modalButtonText}>Enregistrer un audio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    textAlign:'center',
    fontWeight: "700",
    color: "#333",
    marginBottom: 40,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 3,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    width: "100%",
    marginVertical: 6,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  closeButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});

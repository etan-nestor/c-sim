import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import {
  FontAwesome5,
  AntDesign,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { format } from "date-fns";

type Photo = {
  uri: string;
  name: string;
  size: number;
  date: Date;
  type?: string;
  langue?: string;
};

export default function EditPhotoScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [editingNameIndex, setEditingNameIndex] = useState<number | null>(null);
  const [newName, setNewName] = useState("");

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Permission requise pour utiliser la caméra.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (!asset) return;

    const fileInfo = await FileSystem.getInfoAsync(asset.uri);
    const fileSize = fileInfo.exists ? fileInfo.size ?? 0 : 0;

    const newPhoto: Photo = {
      uri: asset.uri,
      name: format(new Date(), "yyyyMMdd_HHmmss"),
      size: fileSize,
      date: new Date(),
      type: "", // Valeur par défaut
      langue: "", // Valeur par défaut
    };

    setPhotos((prev) => [...prev, newPhoto]);
  };

  const handleDeletePhoto = (index: number) => {
    Alert.alert("Supprimer", "Supprimer cette photo ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => setPhotos(photos.filter((_, i) => i !== index)),
      },
    ]);
  };

  const handleStartRename = (index: number) => {
    setEditingNameIndex(index);
    setNewName(photos[index].name);
  };

  const handleRenameConfirm = () => {
    if (editingNameIndex === null) return;
    const updated = [...photos];
    updated[editingNameIndex].name = newName;
    setPhotos(updated);
    setEditingNameIndex(null);
  };

  const handleViewDetails = (photo: Photo) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  const updatePhotoField = (field: keyof Photo, value: string) => {
    if (!selectedPhoto) return;
    const updatedPhotos = photos.map((p) =>
      p.uri === selectedPhoto.uri ? { ...p, [field]: value } : p
    );
    setPhotos(updatedPhotos);
    setSelectedPhoto((prev) => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 Galerie de Photos</Text>

      <ScrollView contentContainerStyle={styles.photoContainer}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoCard}>
            <TouchableOpacity onPress={() => handleViewDetails(photo)}>
              <Image
                source={{ uri: photo.uri }}
                style={styles.photoThumbnail}
              />
            </TouchableOpacity>

            {editingNameIndex === index ? (
              <View style={styles.renameContainer}>
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  style={styles.input}
                />
                <TouchableOpacity onPress={handleRenameConfirm}>
                  <Feather name="check" size={20} color="green" />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.photoName}>{photo.name}</Text>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => handleStartRename(index)}
                style={styles.actionButton}
              >
                <AntDesign name="edit" size={18} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeletePhoto(index)}
                style={styles.actionButton}
              >
                <MaterialIcons name="delete" size={18} color="#FF3B30" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleViewDetails(photo)}
                style={styles.actionButton}
              >
                <Feather name="info" size={18} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
        <FontAwesome5 name="camera-retro" size={24} color="#fff" />
        <Text style={styles.buttonText}>Prendre une Photo</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPhoto && (
              <>
                <Text style={styles.modalTitle}>📝 {selectedPhoto.name}</Text>
                <Text>Taille: {(selectedPhoto.size / 1024).toFixed(2)} KB</Text>
                <Text>
                  Date: {format(selectedPhoto.date, "dd/MM/yyyy HH:mm")}
                </Text>

                <View style={{ width: "100%", marginTop: 20 }}>
                  <Text style={{ fontWeight: "600", marginBottom: 5 }}>Type</Text>
                  <Picker
                    selectedValue={selectedPhoto.type}
                    onValueChange={(itemValue) => updatePhotoField("type", itemValue)}
                    style={{ backgroundColor: "#f2f2f2", borderRadius: 8 }}
                  >
                    <Picker.Item label="Sélectionner..." value="" />
                    <Picker.Item label="Enseignement" value="enseignement" />
                    <Picker.Item label="Prédication" value="predication" />
                    <Picker.Item label="Témoignage" value="temoignage" />
                    <Picker.Item label="Conseils" value="conseils" />
                  </Picker>

                  <Text style={{ fontWeight: "600", marginVertical: 10 }}>Langue</Text>
                  <Picker
                    selectedValue={selectedPhoto.langue}
                    onValueChange={(itemValue) => updatePhotoField("langue", itemValue)}
                    style={{ backgroundColor: "#f2f2f2", borderRadius: 8 }}
                  >
                    <Picker.Item label="Sélectionner..." value="" />
                    <Picker.Item label="Français" value="fr" />
                    <Picker.Item label="Anglais" value="en" />
                    <Picker.Item label="Mooré" value="moore" />
                    <Picker.Item label="Gourmantché" value="gourmantche" />
                    <Picker.Item label="Autres" value="autres" />
                  </Picker>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  photoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photoCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  photoThumbnail: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  photoName: { fontWeight: "600", fontSize: 15, color: "#333" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionButton: { padding: 6, backgroundColor: "#f0f0f0", borderRadius: 30 },
  renameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    flex: 1,
    marginRight: 10,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 15,
  },
  modalTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  closeButtonText: { color: "#fff", fontWeight: "600" },
});

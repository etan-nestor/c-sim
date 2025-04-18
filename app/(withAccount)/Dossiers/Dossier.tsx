import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import FolderCard from "../../components/FolderCard";
import FolderItem from "../../components/FolderItem";
import { FolderType } from "../../types/FolderType";

const addSubfolderRecursively = (
  folders: FolderType[],
  parentId: string,
  newSubfolder: FolderType
): FolderType[] => {
  return folders.map((folder) => {
    if (folder.id === parentId) {
      return {
        ...folder,
        children: [...folder.children, newSubfolder],
      };
    } else if (folder.children.length > 0) {
      return {
        ...folder,
        children: addSubfolderRecursively(
          folder.children,
          parentId,
          newSubfolder
        ),
      };
    }
    return folder;
  });
};

export default function Dossier() {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [subFolderName, setSubFolderName] = useState("");

  const handleAddFolder = () => {
    if (!currentName.trim()) return;
  
    if (editingId) {
      // Modification
      setFolders((prev) => editFolderRecursively(prev, editingId, currentName));

    } else {
      // Création d’un dossier racine
      const newFolder: FolderType = {
        id: Date.now().toString(),
        name: currentName,
        children: [],
        level: 0,
      };
      setFolders((prev) => [...prev, newFolder]);
    }
  
    setCurrentName("");
    setEditingId(null);
    setModalVisible(false);
  };
  

  const getFolderLevel = (folders: FolderType[], parentId: string): number => {
    for (const folder of folders) {
      if (folder.id === parentId) return folder.level;
      if (folder.children.length > 0) {
        const result = getFolderLevel(folder.children, parentId);
        if (result !== -1) return result;
      }
    }
    return -1;
  };

  const findFolderById = (
    folders: FolderType[],
    id: string
  ): FolderType | null => {
    for (const folder of folders) {
      if (folder.id === id) return folder;
      const found = findFolderById(folder.children, id);
      if (found) return found;
    }
    return null;
  };

  const handleEdit = (id: string) => {
    const folder = findFolderById(folders, id);
    if (folder) {
      setCurrentName(folder.name);
      setEditingId(folder.id);
      setModalVisible(true);
    }
  };

  const editFolderRecursively = (
    folders: FolderType[],
    id: string,
    newName: string
  ): FolderType[] => {
    return folders.map((folder) => {
      if (folder.id === id) {
        return { ...folder, name: newName };
      }
      return {
        ...folder,
        children: editFolderRecursively(folder.children, id, newName),
      };
    });
  };

  const deleteFolderRecursively = (
    folders: FolderType[],
    id: string
  ): FolderType[] => {
    return folders
      .filter((folder) => folder.id !== id)
      .map((folder) => ({
        ...folder,
        children: deleteFolderRecursively(folder.children, id),
      }));
  };

  const handleDelete = (id: string) => {
    setFolders((prev) => deleteFolderRecursively(prev, id));
  };

  const handleAddSubfolder = (parentId: string) => {
    if (parentId) {
      // Vérifie si `parentId` est un string valide
      setSelectedParentId(parentId);
      setSubModalVisible(true);
    }
  };

  const createSubFolder = () => {
    if (!subFolderName.trim() || !selectedParentId) return;

    const parentLevel = getFolderLevel(folders, selectedParentId);
    if (parentLevel === -1) return;

    const newSubfolder: FolderType = {
      id: Date.now().toString(),
      name: subFolderName,
      children: [],
      level: parentLevel + 1,
    };

    setFolders((prev) =>
      addSubfolderRecursively(prev, selectedParentId, newSubfolder)
    );

    setSubFolderName("");
    setSelectedParentId(null);
    setSubModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <>
            <FolderCard
              folder={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <FolderItem
              folder={item}
              onAddSubfolder={handleAddSubfolder}
              onEdit={handleEdit}
              onDelete={handleDelete}
              level={0}
            />
          </>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun dossier pour le moment.</Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setModalVisible(false);
          setCurrentName("");
          setEditingId(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? "Modifier le dossier" : "Nouveau dossier"}
            </Text>
            <TextInput
              value={currentName}
              onChangeText={setCurrentName}
              placeholder="Nom du dossier"
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleAddFolder}
            >
              <Text style={styles.modalButtonText}>
                {editingId ? "Modifier" : "Créer"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={subModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => {
          setSubModalVisible(false);
          setSubFolderName("");
          setSelectedParentId(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un sous-dossier</Text>
            <TextInput
              value={subFolderName}
              onChangeText={setSubFolderName}
              placeholder="Nom du sous-dossier"
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={createSubFolder}
            >
              <Text style={styles.modalButtonText}>Créer</Text>
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
    padding: 16,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#FF6B00",
    borderRadius: 30,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#00000055",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#222",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  modalButton: {
    backgroundColor: "#FF6B00",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

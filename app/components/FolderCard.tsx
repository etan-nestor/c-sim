import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FolderType } from "../types/FolderType";

type Props = {
  folder: FolderType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function FolderCard({ folder, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Feather name="folder" size={24} color="#FF6B00" style={styles.icon} />
        <Text style={styles.name}>{folder.name}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(folder.id)}>
          <Feather name="edit" size={20} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(folder.id)}>
          <Feather name="trash" size={20} color="#B00020" style={{ marginLeft: 12 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});

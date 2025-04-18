import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FolderType } from "../types/FolderType";
import { useRouter } from "expo-router";

type Props = {
  folder: FolderType;
  onAddSubfolder: (parentId: string) => void;
  level?: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const FolderItem = ({ folder, onAddSubfolder, onEdit, onDelete, level = 0 }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const handlePress = () => {
    if (level === 2) {
      // À partir du niveau 2 : accès au contenu
      router.push(`/Dossiers/note/${folder.id}`);
    } else {
      setExpanded(!expanded);
    }
  };

  const canAddSubfolder = level < 2;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.folderRow}>
        {folder.children.length > 0 || level < 2 ? (
          <Feather
            name={expanded ? "chevron-down" : "chevron-right"}
            size={18}
            color="#555"
          />
        ) : (
          <Feather name="file" size={18} color="#ccc" />
        )}
        <Feather name="folder" size={20} color="#FFA500" />
        <Text style={styles.name}>{folder.name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {canAddSubfolder && (
            <TouchableOpacity onPress={() => onAddSubfolder(folder.id)}>
              <Feather name="plus-square" size={20} color="#555" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => onEdit(folder.id)}>
            <Feather name="edit" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(folder.id)}>
            <Feather name="trash" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {expanded && folder.children.length > 0 && (
        <View style={styles.subFolder}>
          {folder.children.map((sub) => (
            <FolderItem
              key={sub.id}
              folder={sub}
              onAddSubfolder={onAddSubfolder}
              onEdit={onEdit}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default FolderItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  folderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  subFolder: {
    marginLeft: 20,
    marginTop: 4,
  },
});

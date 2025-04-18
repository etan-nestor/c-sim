import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

type Section = {
  id: string;
  title: string;
  content: string;
};

const LessonEditor = () => {
  const [type, setType] = useState("enseignement");
  const [langue, setLangue] = useState("francais");
  const [theme, setTheme] = useState("");
  const [lecture, setLecture] = useState("");
  const [auteur, setAuteur] = useState("");
  const [interprete, setInterprete] = useState("");
  const [sections, setSections] = useState<Section[]>([
    { id: "1", title: "", content: "" },
  ]);

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { id: Date.now().toString(), title: "", content: "" },
    ]);
  };

  const removeSection = (index: number) => {
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
  };

  const handleSectionChange = (
    index: number,
    field: "title" | "content",
    value: string
  ) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    setSections((prevSections: Section[]) => {
      const updatedSections = [...prevSections];
      const movedItem = updatedSections.splice(fromIndex, 1)[0];
      updatedSections.splice(toIndex, 0, movedItem);
      return updatedSections;
    });
  };

  return (
    <>
      <View style={styles.cardTitle}>
        <Text style={styles.title}>Nouvelle Leçon</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Sélecteurs Type & Langue */}
        <View style={styles.selectorGroup}>
          <View style={styles.selector}>
            <View style={styles.selectorLabelRow}>
              <Ionicons name="list-circle" size={22} color="#2c3e50" />
              <Text style={styles.selectorLabel}>Type</Text>
            </View>
            <Picker
              selectedValue={type}
              onValueChange={(itemValue) => setType(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Enseignement" value="enseignement" />
              <Picker.Item label="Prédication" value="predication" />
              <Picker.Item label="Témoignage" value="temoignage" />
              <Picker.Item label="Conseils" value="conseils" />
            </Picker>
          </View>

          <View style={styles.selector}>
            <View style={styles.selectorLabelRow}>
              <MaterialIcons name="language" size={22} color="#2c3e50" />
              <Text style={styles.selectorLabel}>Langue</Text>
            </View>
            <Picker
              selectedValue={langue}
              onValueChange={(itemValue) => setLangue(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Français" value="francais" />
              <Picker.Item label="Anglais" value="anglais" />
              <Picker.Item label="Mooré" value="moore" />
              <Picker.Item label="Gourmantché" value="gourmantche" />
              <Picker.Item label="Autres" value="autres" />
            </Picker>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Thème de la leçon"
          value={theme}
          onChangeText={setTheme}
        />
        <TextInput
          style={styles.input}
          placeholder="Lecture(s) de base (versets)"
          value={lecture}
          onChangeText={setLecture}
        />
        <TextInput
          style={styles.input}
          placeholder="Auteur"
          value={auteur}
          onChangeText={setAuteur}
        />
        <TextInput
          style={styles.input}
          placeholder="Interprète"
          value={interprete}
          onChangeText={setInterprete}
        />

        {sections.map((item: Section, index: number) => (
          <PanGestureHandler
            key={item.id}
            onGestureEvent={() => {}}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.END) {
                moveSection(index, index + 1);
              }
            }}
          >
            <Animated.View style={styles.sectionContainer}>
              <TextInput
                style={styles.sectionTitle}
                placeholder={`Titre Section ${index + 1}`}
                value={item.title}
                onChangeText={(text) =>
                  handleSectionChange(index, "title", text)
                }
              />
              <TextInput
                style={styles.sectionContent}
                placeholder="Contenu..."
                multiline
                value={item.content}
                onChangeText={(text) =>
                  handleSectionChange(index, "content", text)
                }
              />
              <View style={styles.sectionActions}>
                <TouchableOpacity onPress={() => moveSection(index, index - 1)}>
                  <Feather name="arrow-up" size={20} color="#2c3e50" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => moveSection(index, index + 1)}>
                  <Feather name="arrow-down" size={20} color="#2c3e50" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeSection(index)}>
                  <Feather name="trash-2" size={20} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </PanGestureHandler>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addSection}>
          <Feather name="plus-circle" size={22} color="#007AFF" />
          <Text style={styles.addButtonText}>Ajouter une section</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton}>
          <Feather name="save" size={20} color="#fff" />
          <Text style={styles.saveText}>Sauvegarder</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  cardTitle: {
    backgroundColor: "#e9f0ff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
  },
  selectorGroup: {
    marginBottom: 20,
    gap: 16,
  },
  selectorLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  selector: {
    backgroundColor: "#f1f5ff",
    padding: 12,
    borderRadius: 12,
    elevation: 1,
  },
  selectorLabel: {
    fontWeight: "600",
    marginTop: 5,
    marginBottom: 4,
    color: "#2c3e50",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 56, 
    marginTop: 4,
  },
  pickerItem: {
    fontSize: 14,
    color: "#2c3e50",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f0f4ff",
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 6,
  },
  sectionContent: {
    marginTop: 10,
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  sectionActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#007AFF",
    fontSize: 16,
    marginLeft: 8,
  },
  saveButton: {
    flexDirection:'row',
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap:10,
    marginTop: 30,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LessonEditor;

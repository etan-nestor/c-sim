import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import * as Speech from "expo-speech";
import { useFocusEffect } from "@react-navigation/native";

interface LessonContent {
  text: string;
  remarque: boolean;
}

interface Lesson {
  id: string;
  titre: string;
  catégorie: string;
  langue: string;
  numéro: string;
  content: LessonContent[];
}

const LessonDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const docId = Array.isArray(id) ? id[0] : id;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReading, setIsReading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const lessonRef = doc(db, "lessons", docId);
        const lessonSnap = await getDoc(lessonRef);

        if (!lessonSnap.exists()) {
          Alert.alert("Erreur", "Leçon non trouvée");
          setLoading(false);
          return;
        }

        const lessonData = lessonSnap.data();
        const { titre, catégorie, langue, numéro } = lessonData;

        const contentCollectionRef = collection(lessonRef, "content");
        const contentSnap = await getDocs(contentCollectionRef);

        const content: LessonContent[] = contentSnap.docs
          .sort((a, b) => Number(a.id) - Number(b.id)) // Tri numérique des IDs
          .map((doc) => {
            const data = doc.data();
            return {
              text: data.text || "",
              remarque: data.remarque || false,
            };
          });

        const loadedLesson: Lesson = {
          id: lessonSnap.id,
          titre,
          catégorie,
          langue,
          numéro,
          content,
        };

        setLesson(loadedLesson);
      } catch (error) {
        console.error("Erreur lors de la récupération de la leçon :", error);
        Alert.alert("Erreur", "Échec de la récupération de la leçon");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [docId]);

  const generateAndDownloadPDF = async () => {
    if (!lesson) return;

    try {
      const contentHTML = lesson.content
        .map(
          (item) =>
            `<p class="${item.remarque ? "remarque" : ""}">${item.text}</p>`
        )
        .join("");

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #F86C1B; }
              .remarque { font-style: italic; color: #F86C1B; }
            </style>
          </head>
          <body>
            <h1>${lesson.titre}</h1>
            <p><strong>Numéro:</strong> ${lesson.numéro}</p>
            <p><strong>Catégorie:</strong> ${lesson.catégorie}</p>
            <p><strong>Langue:</strong> ${lesson.langue}</p>
            <hr/>
            ${contentHTML}
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const pdfPath = FileSystem.documentDirectory + "lecon.pdf";
      await FileSystem.moveAsync({ from: uri, to: pdfPath });

      Alert.alert(
        "Téléchargement terminé",
        "Le PDF a été enregistré avec succès."
      );
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfPath);
      }
    } catch (error) {
      console.error("Erreur PDF :", error);
      Alert.alert("Erreur", "Échec de la génération du PDF.");
    }
  };

  const toggleReading = () => {
    if (!lesson) return;

    const phrases: string[] = [];
    phrases.push(`Thème : ${lesson.titre}`);
    let pointIndex = 1;

    lesson.content.forEach((item) => {
      if (item.remarque) {
        phrases.push(`Point ${pointIndex} : ${item.text}`);
        pointIndex++;
      } else {
        phrases.push(item.text);
      }
    });

    phrases.push(
      "Merci. Que Dieu vous aide à garder sa parole dans votre cœur et à la mettre en pratique pour votre propre bien."
    );

    const lirePhrase = (index: number) => {
      if (index >= phrases.length) {
        setIsReading(false);
        setCurrentIndex(0);
        return;
      }
      setCurrentIndex(index);
      Speech.speak(phrases[index], {
        language: "fr-FR",
        rate: 0.95,
        onDone: () => lirePhrase(index + 1),
      });
    };

    if (isReading) {
      Speech.stop();
      setIsReading(false);
    } else {
      lirePhrase(currentIndex);
      setIsReading(true);
    }
  };

  const restartReading = () => {
    setCurrentIndex(0);
    toggleReading();
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (isReading) {
          Speech.stop();
          setIsReading(false);
        }
      };
    }, [isReading])
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F86C1B" />
      </View>
    );
  }

  if (!lesson) {
    return <Text>Leçon non trouvée</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <Text style={styles.fixedCategory}>
          {lesson.catégorie.toUpperCase()}
        </Text>
        <Text style={styles.fixedLanguage}>{lesson.langue.toUpperCase()}</Text>
      </View>
      <View style={styles.titleBox}>
        <View style={styles.titleContainer}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{lesson.numéro}</Text>
          </View>
          <Text style={styles.title}>{lesson.titre}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {lesson.content.map((item, index) => (
          <View
            key={index}
            style={[
              styles.contentContainer,
              item.remarque && styles.remarqueContainer,
            ]}
          >
            <Text
              style={[styles.contentText, item.remarque && styles.remarqueText]}
            >
              {item.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={generateAndDownloadPDF}
        >
          <FontAwesome name="file-pdf-o" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, { marginLeft: 24 }]}
          onPress={toggleReading}
        >
          <FontAwesome
            name={isReading ? "pause" : "volume-up"}
            size={20}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, { marginLeft: 24 }]}
          onPress={restartReading}
        >
          <FontAwesome name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scrollContent: {
    padding: 16,
    paddingTop: 145,
    paddingBottom: 100,
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    elevation: 4,
    zIndex: 10,
  },
  fixedCategory: {
    fontWeight: "bold",
    color: "#333",
  },
  fixedLanguage: {
    fontWeight: "bold",
    color: "#333",
  },
  titleBox: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: "orange",
    borderRadius: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  numberBadge: {
    backgroundColor: "orangered",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  numberText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  contentContainer: {
    backgroundColor: "#F7F7F7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    color: "#333",
  },
  remarqueContainer: {
    backgroundColor: "#FFF3E0",
    borderLeftWidth: 5,
    borderLeftColor: "#F86C1B",
  },
  remarqueText: {
    fontStyle: "italic",
    color: "#F86C1B",
    fontWeight:'bold'
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#F86C1B",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
});

export default LessonDetailScreen;

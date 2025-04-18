import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import ListCard from "./ListCard";
import { db } from "../../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

interface Lesson {
  id: string;
  titre: string;
  numéro: string;
  type: string;
  langue?: string;
}

interface LessonListProps {
  type: string;
  languageFilter: string;
  searchText: string;
}

const LessonList: React.FC<LessonListProps> = ({
  type,
  languageFilter,
  searchText,
}) => {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const constraints = [where("type", "==", type)];

        if (languageFilter) {
          constraints.push(where("langue", "==", languageFilter));
        }

        const q = query(collection(db, "lessons"), ...constraints);
        const snapshot = await getDocs(q);

        const fetchedLessons: Lesson[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lesson[];

        setLessons(fetchedLessons);
      } catch (error) {
        console.error("Erreur lors de la récupération des leçons :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [type, languageFilter]);

  const filteredLessons = lessons.filter((item) => {
    const search = searchText.toLowerCase();
    return (
      item.titre.toLowerCase().includes(search) ||
      item.numéro.toLowerCase().includes(search)
    );
  });

  const handleLessonPress = (id: string) => {
    router.push(`/(withoutAccount)/LessonDetailScreen/${id}`);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F86C1B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {filteredLessons.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredLessons}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleLessonPress(item.id)}>
              <ListCard number={item.numéro} title={item.titre} />
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noLessons}>Aucune leçon trouvée.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noLessons: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
});

export default LessonList;

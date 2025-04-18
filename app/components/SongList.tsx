import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import ListCard from "./ListCard";
import { db } from "../../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

type Song = {
  id: string; // ID du document généré par Firestore
  numéro: string;
  titre: string;
  catégorie: string;
  type?: string;
  langue?: string;
};

const SongList = ({
  category,
  type,
  language,
  searchText,
}: {
  category: string;
  type: string;
  language: string;
  searchText: string;
}) => {
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const constraints = [where("catégorie", "==", category)];

        if (type) {
          constraints.push(where("type", "==", type));
        }

        if (language) {
          constraints.push(where("langue", "==", language));
        }

        const songsQuery = query(collection(db, "songs"), ...constraints);
        const snapshot = await getDocs(songsQuery);

        const fetchedSongs: Song[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Song[];

        setSongs(fetchedSongs);
      } catch (error) {
        console.error("Erreur lors de la récupération des chansons :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [category, type, language]);

  // Filtrage local avec le texte de recherche
  const filteredSongs = songs.filter((item) => {
    const search = searchText.toLowerCase();
    return (
      item.titre.toLowerCase().includes(search) ||
      item.numéro.toLowerCase().includes(search)
    );
  });

  const handleSongPress = (id: string) => {
    router.push(`/(withoutAccount)/SongDetailScreen/${id}`);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#F86C1B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {filteredSongs.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredSongs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSongPress(item.id)}>
              <ListCard number={item.numéro} title={item.titre} />
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noSongs}>Aucune chanson trouvée.</Text>
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
  noSongs: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
});

export default SongList;

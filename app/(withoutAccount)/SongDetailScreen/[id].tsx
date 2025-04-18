import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Animated,
} from "react-native";
import { FontAwesome, Ionicons, Entypo } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import { db } from "../../../config/firebaseConfig";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";

const { width } = Dimensions.get("window");

interface Lyric {
  text: string;
  isRefrain: boolean;
}

interface Song {
  id: string;
  titre: string;
  catégorie: string;
  langue: string;
  numéro: string;
  audioUrl?: string;
  lyrics: Lyric[];
}

const SongDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const docId = Array.isArray(id) ? id[0] : id;

  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [playbackStatus, setPlaybackStatus] =
    useState<AVPlaybackStatusSuccess | null>(null);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(1);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const fetchSong = async () => {
      if (!docId) return;
      try {
        setLoading(true);
        const songRef = doc(db, "songs", docId);
        const songSnap = await getDoc(songRef);
        if (!songSnap.exists()) {
          Alert.alert("Erreur", "Chanson non trouvée.");
          return;
        }

        const data = songSnap.data();
        const lyricsRef = collection(songRef, "lyrics");
        const lyricsSnap = await getDocs(lyricsRef);

        const lyrics: Lyric[] = lyricsSnap.docs.map((doc) => ({
          text: doc.data().text || "",
          isRefrain: doc.data().isRefrain || false,
        }));

        const loadedSong: Song = {
          id: songSnap.id,
          titre: data.titre,
          catégorie: data.catégorie,
          langue: data.langue,
          numéro: data.numéro,
          audioUrl: data.audioUrl,
          lyrics,
        };

        setSong(loadedSong);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        Alert.alert("Erreur", "Impossible de charger la chanson.");
      } finally {
        setLoading(false);
      }
    };

    fetchSong();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [docId]);

  const handlePlayPause = async () => {
    if (!song?.audioUrl) return;

    if (soundRef.current && playbackStatus?.isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      if (!soundRef.current) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: song.audioUrl },
          { shouldPlay: true }
        );
        soundRef.current = newSound;

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;

          const loadedStatus = status as AVPlaybackStatusSuccess;
          setPlaybackStatus(loadedStatus);
          setPositionMillis(loadedStatus.positionMillis);
          setDurationMillis(loadedStatus.durationMillis || 1);

          if (loadedStatus.didJustFinish) {
            newSound.setPositionAsync(0);
          }
        });
      } else {
        await soundRef.current.playAsync();
      }
    }
  };

  const handleRestart = async () => {
    if (soundRef.current) await soundRef.current.setPositionAsync(0);
  };

  const handleSeek = async (value: number) => {
    if (soundRef.current) await soundRef.current.setPositionAsync(value);
  };

  const generateAndDownloadPDF = async () => {
    if (!song) return;

    try {
      const lyricsHTML = song.lyrics
        .map(
          (lyric) =>
            `<p style="margin-bottom:10px;" class="${
              lyric.isRefrain ? "refrain" : ""
            }">${lyric.text}</p>`
        )
        .join("");

      const htmlContent = `
        <html><head><style>
        body { font-family: Arial; }
        h1 { color: #F86C1B; }
        .refrain { font-style: italic; color: #F86C1B; }
        </style></head><body>
        <h1>${song.titre}</h1>
        <p><strong>Catégorie:</strong> ${song.catégorie}</p>
        <p><strong>Langue:</strong> ${song.langue}</p>
        <p><strong>Numéro:</strong> ${song.numéro}</p>
        <hr/>
        ${lyricsHTML}
        </body></html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const pdfPath = FileSystem.documentDirectory + "chanson.pdf";
      await FileSystem.moveAsync({ from: uri, to: pdfPath });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfPath);
      }
    } catch (error) {
      Alert.alert("Erreur", "PDF non généré.");
    }
  };
  const hasAudio = !!song?.audioUrl;
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#F86C1B" />
      </View>
    );
  }

  if (!song) {
    return <Text style={styles.notFound}>Chanson non trouvée</Text>;
  }

  return (
    <>
      <View style={styles.navBar}>
        <Text style={styles.navText}>{song.catégorie.toUpperCase()}</Text>
        <Text style={styles.navText}>{song.langue.toUpperCase()}</Text>
      </View>

      <Animated.ScrollView style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.titleWrapper}>
          <View style={styles.titleContainer}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>{song.numéro}</Text>
            </View>
            <Text style={styles.songTitle}>{song.titre}</Text>
          </View>
        </View>

        <View style={styles.lyricsWrapper}>
          {song.lyrics.map((lyric, idx) => (
            <View key={idx} style={styles.lyricBlock}>
              <Text
                style={[
                  styles.lyricLine,
                  lyric.isRefrain && styles.refrainLine,
                ]}
              >
                {lyric.text}
              </Text>
              {idx < song.lyrics.length - 1 && (
                <View style={styles.lineSeparator} />
              )}
            </View>
          ))}
        </View>
      </Animated.ScrollView>

      <View style={styles.footer}>
        {/* Bouton restart - désactivé si pas d'audio */}
        <TouchableOpacity
          onPress={handleRestart}
          style={styles.footerIcon}
          disabled={!hasAudio} // 🆕 désactive le bouton si pas d'audio
        >
          <Ionicons
            name="refresh"
            size={28}
            color={hasAudio ? "white" : "#aaa"} // 🆕 couleur conditionnelle
          />
        </TouchableOpacity>

        {/* Slider audio - grisé si pas d'audio */}
        <View style={styles.sliderContainer}>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={durationMillis}
            value={positionMillis}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor={hasAudio ? "#FFFFFF" : "#ccc"} // 🆕
            maximumTrackTintColor="#ccc"
            thumbTintColor={hasAudio ? "#fff" : "#aaa"} // 🆕
            disabled={!hasAudio} // 🆕 slider désactivé si pas d'audio
          />
        </View>

        {/* Bouton play/pause - désactivé si pas d'audio */}
        <TouchableOpacity
          onPress={handlePlayPause}
          style={styles.footerIcon}
          disabled={!hasAudio} // 🆕
        >
          <FontAwesome
            name={playbackStatus?.isPlaying ? "pause-circle" : "play-circle"}
            size={36}
            color={hasAudio ? "white" : "#aaa"} // 🆕
          />
        </TouchableOpacity>

        {/* Bouton share (PDF) - toujours actif */}
        <TouchableOpacity
          onPress={generateAndDownloadPDF}
          style={styles.footerIcon}
        >
          <Entypo name="share" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", marginTop: 20 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { textAlign: "center", fontSize: 18, marginTop: 30 },
  navBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fafafa",
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  navText: {
    fontWeight: "600",
    color: "#333",
    textTransform: "uppercase",
  },
  titleWrapper: {
    marginTop: 40,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  titleContainer: {
    backgroundColor: "#f3f3f3",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  circle: {
    backgroundColor: "#F86C1B",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flexShrink: 1,
  },
  lyricsWrapper: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 100,
  },
  lyricBlock: {
    marginBottom: 12,
  },
  lyricLine: {
    fontSize: 16,
    color: "#222",
    lineHeight: 24,
  },
  refrainLine: {
    color: "#F86C1B",
    fontStyle: "italic",
    fontWeight: "bold",
  },
  lineSeparator: {
    marginVertical: 10,
    borderBottomColor: "#000",
    borderBottomWidth: 0.5,
    borderStyle: "dotted",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F86C1B",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 10,
  },
  footerIcon: {
    paddingHorizontal: 8,
  },
  sliderContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
});

export default SongDetailScreen;

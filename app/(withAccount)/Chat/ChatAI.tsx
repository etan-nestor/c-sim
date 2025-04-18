import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import MessageBubble from "../../components/MessageBubble";
import CustomToast from "../../components/CustomToast";
import { askChatGPT } from "../../lib/chatgptApi";
import * as Clipboard from "expo-clipboard";

export default function ChatAI() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "bot",
      text: "Shalom !!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSend = async (customInput?: string) => {
    const messageToSend = customInput ?? input;

    if (!messageToSend.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      text: messageToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const botReply = await askChatGPT(messageToSend);

      const botMessage = {
        id: Date.now().toString() + "_bot",
        type: "bot",
        text: botReply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Erreur GPT :", err);

      let errorText = "Oops ! Erreur inconnue 😵";

      if (err?.response?.status === 429) {
        errorText =
          err?.response?.data?.error?.message ||
          "Trop de requêtes 🧠💥. Patiente un peu.";
      } else if (
        err?.response?.status === 400 &&
        err?.response?.data?.error?.message?.includes("maximum context length")
      ) {
        errorText = "Ta question est trop longue 😅. Réessaie en simplifiant.";
      } else if (err?.message?.includes("Network Error")) {
        errorText = "Pas de connexion 📴. Vérifie ta connexion internet.";
      } else if (err?.response?.data?.error?.message) {
        errorText = err.response.data.error.message;
      }

      setToastMessage(errorText);
      setToastVisible(true);

      const errorMessage = {
        id: Date.now().toString() + "_error",
        type: "bot",
        text: "Désolé, je n’ai pas pu répondre 😔.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      flatListRef.current?.scrollToEnd({ animated: true });

      setTimeout(() => {
        setToastVisible(false);
        setToastMessage("");
      }, 4000);
    }
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setToastMessage("Réponse copiée !");
    setToastVisible(true);
  };

  const handleReformulate = (text: string) => {
    handleSend(`Peux-tu reformuler ceci plus simplement : ${text}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        renderItem={({ item }) => (
          <MessageBubble
            item={item}
            onCopy={handleCopy}
            onReformulate={handleReformulate}
          />
        )}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {loading && (
        <View style={styles.loadingBubble}>
          <Image
            source={require("../../../assets/avatar-bot.png")}
            style={styles.avatar}
          />
          <View style={styles.botBubble}>
            <Text style={styles.dots}>...</Text>
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Pose ta question..."
          placeholderTextColor="#888"
          style={styles.input}
          multiline
        />
        <TouchableOpacity
          onPress={() => handleSend()}
          style={styles.sendButton}
          disabled={loading || !input.trim()}
        >
          <Feather name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        onClose={() => setToastVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5", // plus doux
    paddingHorizontal: 12,
    paddingBottom: 90,
  },
  chatContainer: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: "#ffffffee",
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "flex-end",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },
  input: {
    flex: 1,
    backgroundColor: "#f7f7f9",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    maxHeight: 120,
    color: "#222",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#FF6B00",
    borderRadius: 50,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 6,
  },
  botBubble: {
    backgroundColor: "#e1e1ea",
    borderTopLeftRadius: 0,
    padding: 14,
    borderRadius: 20,
    maxWidth: "75%",
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 14,
    paddingHorizontal: 6,
  },
  dots: {
    fontSize: 22,
    color: "#888",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});

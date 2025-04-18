import React, { useRef, useEffect } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MessageBubble({
  item,
  onCopy,
  onReformulate,
}: {
  item: any;
  onCopy?: (text: string) => void;
  onReformulate?: (text: string) => void;
}) {
  const isUser = item.type === "user";
  const slideAnim = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        opacity: opacityAnim,
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-end",
        marginBottom: 14,
      }}
    >
      <Image
        source={
          isUser
            ? require("../../assets/avatar-user.jpg")
            : require("../../assets/avatar-bot.png")
        }
        style={styles.avatar}
      />
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <View style={styles.messageHeader}>
          {!isUser && (
            <TouchableOpacity onPress={() => onCopy?.(item.text)}>
              <Ionicons name="copy-outline" size={14} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.messageText}>{item.text}</Text>

        {!isUser && (
          <TouchableOpacity
            onPress={() => onReformulate?.(item.text)}
            style={styles.reformulateButton}
          >
            <Text style={styles.reformulateText}>↻ Reformuler</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "75%",
    padding: 14,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  userBubble: {
    backgroundColor: "#4CAF50",
    borderTopRightRadius: 0,
  },
  botBubble: {
    backgroundColor: "#e1e1ea",
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 15,
    color: "#333",
    marginTop: 4,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  reformulateButton: {
    marginTop: 6,
  },
  reformulateText: {
    color: "#007AFF",
    fontSize: 13,
    textAlign: "right",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 6,
  },
});

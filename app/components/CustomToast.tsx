import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";

interface Props {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export default function CustomToast({ visible, message, onClose }: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.toast}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.message}>
              {message}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    backgroundColor: "transparent",
  },
  toast: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  message: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});

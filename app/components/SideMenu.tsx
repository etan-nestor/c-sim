import React from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function SideMenu({
  visible,
  slideAnim,
  onClose,
}: {
  visible: boolean;
  slideAnim: Animated.Value;
  onClose: () => void;
}) {
  const router = useRouter();

  if (!visible) return null;

  
  const handleNavigate = (label: string) => {
    switch (label) {
      case "Chat":
        onClose(); 
        router.replace("/(withAccount)/Chat/ChatAI"); 
        break;
      
      default:
        
        break;
    }
  };

  return (
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.menuBackground}>
          <ScrollView
            contentContainerStyle={styles.menuContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            <MenuItem icon="book-open" label="Etude Biblique" onPress={handleNavigate} />
            <MenuItem icon="book" label="Ma BIBLE" onPress={handleNavigate} />
            <MenuItem icon="help-circle" label="Quiz" onPress={handleNavigate} />
            <MenuItem icon="message-square" label="Chat" onPress={handleNavigate} />
            <MenuItem icon="calendar" label="Plan" onPress={handleNavigate} />
            <MenuItem icon="headphones" label="Musique Gospel" onPress={handleNavigate} />
            <MenuItem icon="settings" label="Parametres" onPress={handleNavigate} />
          </ScrollView>
        </View>
      </Animated.View>
    </Pressable>
  );
}


function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: (label: string) => void;
}) {
  return (
    <Pressable onPress={() => onPress(label)}>
      <BlurView intensity={40} tint="light" style={styles.menuItemContainer}>
        <View style={styles.menuItemRow}>
          <Feather name={icon} size={20} color="#333" />
          <Text style={styles.menuItem}>{label}</Text>
        </View>
      </BlurView>
    </Pressable>
  );
}

function LogoutItem({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={[styles.menuItemContainer, styles.logoutContainer]}>
      <View style={styles.menuItemRow}>
        <Feather name={icon} size={20} color="#fff" />
        <Text style={styles.menuItem}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "flex-end",
  },
  menuContainer: {
    position: "absolute",
    top: 75,
    bottom: 95,
    right: 0,
    width: width * 0.68,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    overflow: "hidden",
    elevation: 20,
    backgroundColor: "#ddd", // même fond que le footer
  },
  menuBackground: {
    flex: 1,
    padding: 20,
  },
  menuContent: {
    gap: 20,
    paddingBottom: 40,
  },
  menuItemContainer: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItem: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  logoutContainer: {
    backgroundColor: "rgba(255, 69, 58, 0.15)",
    shadowColor: "#FF453A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});

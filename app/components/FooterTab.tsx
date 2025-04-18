import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Modal,
  Animated,
  Pressable,
  ScrollView,
} from "react-native";
import { Feather} from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import SideMenu from "./SideMenu";

const { width, height } = Dimensions.get("window");
const tabWidth = width / 4;

export default function FooterTab() {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;
  const activeAnim = useRef(new Animated.Value(0)).current;

  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { key: "home", icon: "home", label: "Accueil", path: "Home" },
    { key: "fav", icon: "heart", label: "Favoris", path: "Favoris/Favori" },
    { key: "folder", icon: "folder", label: "Dossiers", path: "Dossiers/Dossier" },
    { key: "menu", icon: "menu", label: "Menu" },
  ];

  const getCurrentTabIndex = () => {
    if (pathname.toLowerCase().includes("home")) return 0;
    if (pathname.toLowerCase().includes("favoris")) return 1;
    if (pathname.toLowerCase().includes("dossier")) return 2;
    return -1;
  };

  const activeIndex = getCurrentTabIndex();

  useEffect(() => {
    if (activeIndex >= 0) {
      Animated.spring(activeAnim, {
        toValue: activeIndex * tabWidth,
        useNativeDriver: false,
        speed: 10,
        bounciness: 8,
      }).start();
    }
  }, [activeIndex]);

  useEffect(() => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [menuVisible]);

  const handleTabPress = (tab: any, index: number) => {
    if (tab.key === "menu") {
      setMenuVisible(true);
    } else {
      const currentPath = pathname.toLowerCase();
      const targetPath = `/${tab.path.toLowerCase()}`;
      if (currentPath !== targetPath) {
        router.replace(tab.path);
      }
    }
  };

  return (
    <>
      <View style={styles.footer}>
        {activeIndex >= 0 && (
          <Animated.View
            style={[
              styles.slider,
              { left: activeAnim, width: tabWidth - 10 },
            ]}
          />
        )}

        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab, index)}
              activeOpacity={0.8}
            >
              <Feather
                name={tab.icon as any}
                size={22}
                color={isActive ? "#fff" : "#333"}
              />
              <Text
                style={[styles.tabLabel, isActive && styles.activeLabel]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal transparent visible={menuVisible} animationType="none">
  <SideMenu visible={menuVisible} slideAnim={slideAnim} onClose={() => setMenuVisible(false)} />
</Modal>
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    width,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#eee",
    paddingVertical: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
    overflow: "hidden",
  },
  slider: {
    position: "absolute",
    top: 8,
    bottom: 8,
    backgroundColor: "orangered",
    borderRadius: 20,
    marginHorizontal: 5,
    zIndex: -1,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#333",
  },
  activeLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "flex-end",
  },
  menuContainer: {
    position: "absolute",
    top: 75, // hauteur navbar présumée
    bottom: 95, // hauteur footer présumée
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 15,
    width: width * 0.6,
  },
  menuContent: {
    gap: 20,
  },
  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItem: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
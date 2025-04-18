import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TabNavigationNa = () => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
                <Ionicons name="home" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "orangered",
        height: 60, // Hauteur fixe pour éviter qu'il chevauche le contenu
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 35,
        backgroundColor: "#52B402",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
});

export default TabNavigationNa;

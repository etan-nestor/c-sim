import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const NavbarNa = () => {
    const router = useRouter();
    return (
        <View style={styles.navbar}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} />
            <TouchableOpacity onPress={() => router.push("/(auth)/Register")} style={styles.button}>
                <Text style={styles.buttonText}>Créer un compte</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#dddd',
        elevation: 3,
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius:100
    },
    button: {
        backgroundColor: "#FF4500",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default NavbarNa;

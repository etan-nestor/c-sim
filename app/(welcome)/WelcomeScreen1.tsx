import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomeScreen1() {
    const router = useRouter();

    const handleSwipe = () => {
        router.replace("/(welcome)/WelcomeScreen2"); // Passer à la page suivante
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#FF4500" barStyle="light-content" />

            <Image source={require("../../assets/images/Hello.png")} style={styles.topImage} resizeMode="contain" />

            <Text style={styles.title}>Bienvenue dans Chantons Ensemble</Text>

            <Image source={require("../../assets/images/welcome1.png")} style={styles.mainImage} resizeMode="contain" />

            <Text style={styles.subtitle}>EE.SIM</Text>
            <Text style={styles.description}>Accédez facilement à tous les cantiques. Simple, rapide et toujours à portée de main.</Text>

            <View style={styles.dotsContainer}>
                <View style={[styles.dot, styles.activeDot]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
            </View>

            {/* Next Button with Icon */}
            <TouchableOpacity onPress={handleSwipe} style={styles.nextButton}>
                <Ionicons name="chevron-forward" size={32} color="limegreen" />
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity onPress={() => router.replace("/(auth)/ChooseLoginType")} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    topImage: {
        width: 141,
        height: 133,
        marginBottom: -20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FF4500",
        textAlign: 'center',
    },
    mainImage: {
        width: 300,
        height: 300,
        marginVertical: 20,
    },
    subtitle: {
        fontSize: 18,
        color: "#FF4500",
        fontWeight: "bold",
    },
    description: {
        fontSize: 14,
        textAlign: "center",
        marginHorizontal: 20,
    },
    dotsContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#F57830",
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: "limegreen",
    },
    nextButton: {
        position: "absolute",
        bottom: 40,
        right: 20,
        padding: 10,
        backgroundColor: "transparent",
    },
    skipButton: {
        padding: 5,
        marginTop: 10,
        borderWidth: 1,
        borderRadius:5,
        borderColor: "#F57830",
    },
    skipText: {
        fontSize: 14,
        color: "black",
        fontWeight: 400,
    },
});

import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Import des icônes

export default function WelcomeScreen3() {
    const router = useRouter();

    const handleBack = () => {
        router.replace("/(welcome)/WelcomeScreen2"); // Retour à l'écran précédent
    };

    const handleStart = () => {
        router.replace("/(auth)/ChooseLoginType"); // Aller à la page de choix de connexion
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#FF4500" barStyle="light-content" />

            {/* Image "blob" en haut à gauche */}
            <Image source={require("../../assets/images/blob1.png")} style={styles.blobImage} resizeMode="contain" />

            {/* Titre */}
            <Text style={styles.title}>Prêt à explorer vos chants ?</Text>

            {/* Image "welcome3" */}
            <Image source={require("../../assets/images/welcome3.png")} style={styles.mainImage} resizeMode="contain" />

            {/* Texte centré */}
            <Text style={styles.description}>
                Chantez et louez avec joie ! Plongez dans les merveilles des cantiques du Seigneur.
            </Text>

            {/* Petite image sous le texte */}
            <Image source={require("../../assets/images/small-image.png")} style={styles.smallImage} resizeMode="contain" />

            {/* Points de progression */}
            <View style={styles.dotsContainer}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={[styles.dot, styles.activeDot]} />
            </View>

            {/* Bouton Commencer */}
                <TouchableOpacity onPress={handleStart} style={styles.startButton}>
                    <Text style={styles.startText}>Commencer</Text>
                </TouchableOpacity>
            <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={32} color="orange" />
                </TouchableOpacity>
                {/* Petit texte avec icône d'info en bas à droite */}
                <TouchableOpacity style={styles.infoButton}>
                    <Ionicons name="information-circle-outline" size={15} color="#E05858" />
                    <Text style={styles.infoText}>En savoir plus</Text>
                </TouchableOpacity>
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    blobImage: {
        position: "absolute",
        top: -20,
        left: -10,
        width: 100,
        height: 100,
        opacity: 0.7,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#FA5F05",
        marginLeft: 100,
        marginTop:70,
    },
    mainImage: {
        width: "90%",
        height: 300,
        marginTop: 15,
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        color: "#111",
        marginVertical: 5,
        paddingHorizontal: 20,
    },
    smallImage: {
        width: 120,
        height: 147,
    },
    dotsContainer: {
        flexDirection: "row",
        marginBottom: 5,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#F57830",
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: "#61BE0A",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        width: "100%",
        marginBottom: 50,
    },
    backButton: {
        padding: 10,
    },
    startButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
        borderRadius: 5,
        minWidth: 120,
    },
    startText: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
    },
    
    infoButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    infoText: {
        fontSize: 12,
        color: "#777",
        marginLeft: 5,
    },
});


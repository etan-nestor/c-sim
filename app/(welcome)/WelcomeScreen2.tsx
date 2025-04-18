import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Pour les icônes

export default function WelcomeScreen2() {
    const router = useRouter();

    const handleSwipe = () => {
        router.replace("/(welcome)/WelcomeScreen3"); // Passer à la page suivante
    };

    const handleBack = () => {
        router.replace("/(welcome)/WelcomeScreen1"); // Retourner à la page WelcomeScreen1
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#FF4500" barStyle="light-content" />

            {/* Image de bienvenue */}
            <Image source={require("../../assets/images/welcome2.png")} style={styles.mainImage} resizeMode="contain" />

            {/* Section image + texte */}
            <View style={styles.explain}>
                <View style={styles.section}>
                    <Image source={require("../../assets/images/ic1.png")} style={styles.iconImage} resizeMode="contain" />
                    <Text style={styles.sectionText}>Accédez à vos chants même hors ligne.</Text>
                </View>

                {/* Section image + texte */}
                <View style={styles.section}>
                    <Image source={require("../../assets/images/ic2.png")} style={styles.iconImage} resizeMode="contain" />
                    <Text style={styles.sectionText}>Organisez vos chants et créez vos favoris.</Text>
                </View>

                {/* Section image + texte */}
                <View style={styles.section}>
                    <Image source={require("../../assets/images/ic3.png")} style={styles.iconImage} resizeMode="contain" />
                    <Text style={styles.sectionText}>Partagez et commentez vos chants préférés.</Text>
                </View>
            </View>

            {/* Barre orangered à gauche */}
            <View style={styles.bar} />

            {/* Texte sous la barre */}
            <Text style={styles.infoText}>Explorez une expérience personnalisée avec une interface simple et fluide. Créez vos propres dossiers pour classer vos cantiques selon vos besoins.</Text>

            {/* Barre fine et longue à gauche */}
            <View style={styles.longBar} />

            {/* Points de progression */}
            <View style={styles.dotsContainer}>
                <View style={styles.dot} />
                <View style={[styles.dot, styles.activeDot]} />
                <View style={styles.dot} />
            </View>

            {/* Boutons (Skip, Next, Back) */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={32} color="orange" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.replace("/(auth)/ChooseLoginType")} style={styles.skipButton}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSwipe} style={styles.nextButton}>
                    <Ionicons name="chevron-forward" size={32} color="white" />
                </TouchableOpacity>
            </View>

            {/* Image blog à droite */}
            <Image source={require("../../assets/images/blob.png")} style={styles.blogImage} resizeMode="contain" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start", // Aligner tout vers le haut
        paddingHorizontal: 15, // Marges latérales ajustées
        paddingBottom: 20, // Espacement inférieur pour éviter que tout touche le bas
    },
    mainImage: {
        width: "90%", // Utiliser 90% de la largeur de l'écran
        height: 300,
        marginTop: 10,
    },
    explain: {
        width: "100%", // Prendre toute la largeur de l'écran sans déborder
        marginLeft: 10, // Légère marge à gauche
        paddingTop: 10,
        marginBottom: 5,
    },
    section: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10, // Espacement entre chaque section
    },
    iconImage: {
        width: 22,
        height: 31,
        marginRight: 10, // Espacement entre l'icône et le texte
    },
    sectionText: {
        fontSize: 12,
        fontWeight: 600,
        color: "#333",
        flexShrink: 1, // Empêche le texte de déborder
    },
    bar: {
        width: 140,  // Réduire la taille de la barre
        height: 10,
        backgroundColor: "#FF4500",
        marginLeft: -185, // Décalage à gauche
    },
    infoText: {
        fontSize: 14,
        color: "#333",
        textAlign: "left",
        marginTop: 5,
    },
    longBar: {
        width: "100%",
        height: 5,
        backgroundColor: "#F57830",
        marginTop: 10,
    },
    dotsContainer: {
        flexDirection: "row",
        marginTop: 60,
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
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 20,
        marginTop: 30,
    },
    backButton: {
        padding: 10,
    },
    skipButton: {
        padding:10,
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#F57830",
    },
    skipText: {
        fontSize: 14,
        color: "black",
        fontWeight: 400,
    },
    nextButton: {
        padding: 10,
        alignItems: "center",
        textAlign: "center",
        borderRadius: 100,
        zIndex: 10,
        backgroundColor: "coral",
    },
    blogImage: {
        position: "absolute",
        bottom: 0,
        right: -30,
        width: 159,
        height: 124,
        opacity: 0.6,
    },
});

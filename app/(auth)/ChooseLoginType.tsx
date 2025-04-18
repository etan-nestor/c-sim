import { View, Text, TouchableOpacity, Image, StyleSheet,StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ChooseLoginType() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#FF4500" barStyle="light-content" />
            {/* Image principale */}
            <Image source={require("../../assets/images/choose.png")} style={styles.mainImage} />

            {/* Titre */}
            <Text style={styles.title}>Bienvenue dans l'univers des chants</Text>

            {/* Boutons */}
            <TouchableOpacity onPress={() => router.push("/(auth)/Register")} style={[styles.button, styles.orangeButton]}>
                <Text style={styles.buttonText}>Créer un compte</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(auth)/Login")} style={[styles.button, styles.greenButton]}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(withoutAccount)/HomeWithoutAccount")} style={[styles.button, styles.orangeButton]}>
                <Text style={styles.buttonText}>Continuer sans compte</Text>
            </TouchableOpacity>

            {/* Texte explicatif */}
            <Text style={styles.infoText}>Connectez-vous pour une expérience complète ou accédez directement aux cantiques pour chanter ensemble</Text>

            {/* Image en bas à gauche */}
            <Image source={require("../../assets/images/blob2.png")} style={styles.blobImage} />

            {/* Besoin d'aide ? en bas à droite */}
            <TouchableOpacity style={styles.helpContainer}>
                <Ionicons name="help-circle-outline" size={20} color="red" />
                <Text style={styles.helpText}>Besoin d'aide ?</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    mainImage: {
        width: 250,
        height: 250,
        marginBottom: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        color:"#FF4500",
        marginBottom: 10,
    },
    button: {
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 10,
    },
    orangeButton: {
        backgroundColor: "orangered",
    },
    greenButton: {
        backgroundColor: "green",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    infoText: {
        color: "gray",
        textAlign: "center",
        marginTop: 10,
    },
    blobImage: {
        position: "absolute",
        left: -20,
        bottom: -15,
        width: 80,
        height: 80,
        opacity: 1,
    },
    helpContainer: {
        position: "absolute",
        bottom: 20,
        right: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    helpText: {
        color: "gray",
        marginLeft: 5,
    },
});

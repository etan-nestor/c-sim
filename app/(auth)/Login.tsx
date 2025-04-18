import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useGoogleAuth } from "../../hooks/authWithGoogle";

export default function Login() {
  const router = useRouter();
  const { promptAsync, response, handleGoogleLogin } = useGoogleAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 1️⃣ Flow Email/Password (inchangé)
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erreur", "Email invalide.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      // animation
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => {
          setLoading(false);
          router.replace({ pathname: "/Home", params: { name: user.displayName ?? "Utilisateur" } });
        }, 1000);
      }, 1000);
    } catch {
      Alert.alert("Erreur", "Identifiants invalides ou compte inexistant.");
      setLoading(false);
    }
  };

  // 2️⃣ Flow Google
  // a) on déclenche promptAsync() au clic
  const handleGoogleButtonPress = () => {
    setLoading(true);
    promptAsync({ showInRecents: true });
  };

  // b) on écoute la réponse, et si succès, on récupère user puis redirige
  useEffect(() => {
    const processGoogleResponse = async () => {
      if (response?.type !== "success") {
        // flow terminé sans succès (cancel ou erreur)
        if (loading) {
          setLoading(false);
          Alert.alert("Erreur", "Connexion avec Google annulée.");
        }
        return;
      }
      try {
        const user = await handleGoogleLogin(); // renvoie l'objet user ou null
        if (user) {
          // succès Google
          setSuccess(true);
          setTimeout(() => {
            setLoading(false);
            router.replace({ pathname: "/Home", params: { name: user.displayName ?? "Utilisateur" } });
          }, 1000);
        } else {
          // improbable, mais on gère au cas où
          setLoading(false);
          Alert.alert("Erreur", "Connexion avec Google annulée.");
        }
      } catch {
        setLoading(false);
        Alert.alert("Erreur", "Échec de la connexion Google.");
      }
    };

    processGoogleResponse();
  }, [response]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF4500" barStyle="light-content" />
      <Image source={require("../../assets/images/login.png")} style={styles.image} />
      <Text style={styles.title}>Rejoignez-nous et chantez avec joie !</Text>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="gray" style={styles.iconLeft} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          accessibilityLabel="Adresse email"
        />
      </View>

      {/* Mot de passe */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.iconLeft} />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          accessibilityLabel="Mot de passe"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconRight}
          accessibilityLabel={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Oubli de mot de passe */}
      <Text style={styles.forgotPasswordText}>
        Ohohooo! J’ai oublié mon mot de passe.{" "}
        <Text style={styles.recoverText}>Récupérer</Text>
      </Text>

      {/* Bouton login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Me connecter</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>ou</Text>

      {/* Bouton Google */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleButtonPress}>
        <Text style={styles.googleText}>Me connecter avec</Text>
        <Ionicons name="logo-google" size={20} color="white" />
      </TouchableOpacity>

      {/* Vers Register */}
      <TouchableOpacity
        style={styles.registerContainer}
        onPress={() => router.push("/(auth)/Register")}
      >
        <Ionicons name="person-outline" size={20} color="gray" />
        <Text style={styles.registerText}>
          Vous n'avez pas encore de compte ? Créez-en un.
        </Text>
      </TouchableOpacity>

      {/* Modal de chargement / succès */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.loaderBox}>
            {success ? (
              <Ionicons name="checkmark-circle" size={80} color="green" />
            ) : (
              <ActivityIndicator size="large" color="#FF4500" />
            )}
            <Text style={styles.loaderText}>
              {success ? "Connexion réussie !" : "Connexion en cours..."}
            </Text>
          </View>
        </View>
      </Modal>
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
    image: {
        width: 250,
        height: 250,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: "#F86C1B",
    },
    iconRight: {
        padding: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        paddingHorizontal: 10,
        width: "100%",
        marginBottom: 10,
        shadowColor: "orangered",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    iconLeft: {
        marginRight: 10,
    },
    forgotPasswordText: {
        color: "gray",
        marginTop: 5,
    },
    recoverText: {
        color: "#FF4500",
        fontWeight: "bold",
        textDecorationLine:"underline",
    },
    button: {
        backgroundColor: "green",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        width: "100%",
        marginVertical: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    orText: {
        fontSize: 20,
        marginVertical: 4,
        fontWeight:"bold",
        color: "coral",
    },
    googleButton: {
        flexDirection: "row",
        backgroundColor: "#4285F4",
        padding: 12,
        justifyContent:"center",
        borderRadius: 10,
        alignItems: "center",
        gap:10,
        width: "100%",
        marginBottom: 10,
    },
    googleText: {
        color: "white",
        fontSize: 14,
        textAlign:"center",
        fontWeight: "bold",
    },
    registerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
        marginLeft:65,
    },
    registerText: {
        marginLeft: 10,
        color: "gray",
        textDecorationLine: "underline",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    loaderBox: {
        backgroundColor: "white",
        padding: 30,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
    },
    loaderText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },

});

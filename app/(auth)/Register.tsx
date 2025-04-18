import { useState } from "react";
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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

export default function Register() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fonction de validation avant inscription
  const handleRegister = async () => {
    // Validation des champs
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Aucune Saisie", "Tous les champs sont obligatoires.");
      return;
    }

    // Vérification de la validité de l'email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Email Invalide", "L'email que vous avez entré est invalide.");
      return;
    }

    // Validation de la longueur du mot de passe (au moins 6 caractères)
    if (password.length < 6) {
      Alert.alert(
        "Mot de Passe trop court",
        "Le mot de passe doit comporter au moins 6 caractères."
      );
      return;
    }

    // Vérification que les mots de passe correspondent
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    // Validation de l'acceptation des conditions
    if (!isChecked) {
      Alert.alert("Attention !", "Vous devez accepter les conditions d'utilisation.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Mise à jour du nom de l'utilisateur
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      // Délai stylé pour l'animation de succès
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => {
          setLoading(false);
          router.replace({ pathname: "/Home", params: { name: fullName } });
        }, 1000);
      }, 1000);
    } catch (error: any) {
      console.error("Erreur d'inscription :", error);
      Alert.alert("Erreur", error.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF4500" barStyle="light-content" />
      <Image
        source={require("../../assets/images/register.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Créer un compte et commencer à chanter !</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={20}
          color="gray"
          style={styles.iconLeft}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="gray"
          style={styles.iconLeft}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="gray"
          style={styles.iconLeft}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconRight}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="gray"
          style={styles.iconLeft}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmer mot de passe"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.iconRight}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? "green" : undefined}
        />
        <Text style={styles.checkboxText}>J'accepte les conditions</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Créer un compte</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/Login")}
        style={styles.loginContainer}
      >
        <Ionicons name="person-outline" size={20} color="gray" />
        <Text style={styles.loginText}>
          Vous avez déjà un compte ? Connectez-vous
        </Text>
      </TouchableOpacity>

      {/* Modal de loading / succès */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.loaderBox}>
            {success ? (
              <Ionicons name="checkmark-circle" size={80} color="green" />
            ) : (
              <ActivityIndicator size="large" color="#FF4500" />
            )}
            <Text style={styles.loaderText}>
              {success ? "Inscription réussie !" : "Création du compte..."}
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
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#F86C1B",
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
  iconRight: {
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxText: {
    marginLeft: 8,
    color: "gray",
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
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 75,
    marginTop: 15,
  },
  loginText: {
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
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
});

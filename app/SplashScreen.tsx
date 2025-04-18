import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    Animated,
    Easing,
    StyleSheet,
    StatusBar,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
    const router = useRouter();

    const logoAnim = useRef(new Animated.Value(0)).current;
    const logoTranslate = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;

    const floatAnim1 = useRef(new Animated.Value(0)).current;
    const floatAnim2 = useRef(new Animated.Value(0)).current;
    const floatAnim3 = useRef(new Animated.Value(0)).current;

    const containerOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Animation d’intro
        Animated.sequence([
            Animated.timing(logoAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 1000,
                    delay: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(logoTranslate, {
                    toValue: -height * 0.05, // Corrigé : montée modérée
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(subtitleOpacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Petite pause puis fondu de sortie
            setTimeout(() => {
                Animated.timing(containerOpacity, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }).start(() => {
                    router.replace("/(welcome)/WelcomeScreen1");
                });
            }, 3000);
        });

        // Animations infinies flottantes
        const loopFloat = (anim: Animated.Value | Animated.ValueXY, delay = 0) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: -10,
                        duration: 2000,
                        easing: Easing.inOut(Easing.ease),
                        delay,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 10,
                        duration: 2000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        loopFloat(floatAnim1);
        loopFloat(floatAnim2, 500);
        loopFloat(floatAnim3, 1000);
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
            <StatusBar backgroundColor="#FF4500" barStyle="light-content" />

            {/* Logo animé */}
            <Animated.Image
                source={require("../assets/logo.png")}
                style={[
                    styles.logo,
                    {
                        opacity: logoAnim,
                        transform: [
                            {
                                scale: logoAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.5, 1.2],
                                }),
                            },
                            {
                                rotate: logoAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["0deg", "360deg"],
                                }),
                            },
                            { translateY: logoTranslate },
                        ],
                    },
                ]}
                resizeMode="contain"
            />

            {/* Texte principal */}
            <Animated.Text style={[styles.mainText, { opacity: textOpacity }]}>
                “Chantez à l’Éternel un cantique nouveau...”
            </Animated.Text>

            {/* Sous-titre */}
            <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
                Votre compagnon spirituel pour apprendre et chanter.
            </Animated.Text>

            {/* Décorations animées */}
            <Animated.View
                style={[
                    styles.floatingNote,
                    {
                        top: height * 0.2,
                        left: width * 0.15,
                        transform: [{ translateY: floatAnim1 }],
                    },
                ]}
            >
                <Text style={styles.emoji}>🎵</Text>
            </Animated.View>

            <Animated.View
                style={[
                    styles.floatingNote,
                    {
                        top: height * 0.25,
                        left: width * 0.75,
                        transform: [{ translateY: floatAnim2 }],
                    },
                ]}
            >
                <Text style={styles.emoji}>🎶</Text>
            </Animated.View>

            <Animated.View
                style={[
                    styles.floatingNote,
                    {
                        top: height * 0.1,
                        left: width * 0.5,
                        transform: [{ translateY: floatAnim3 }],
                    },
                ]}
            >
                <Text style={styles.emoji}>✨</Text>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FF4500",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 150,
        height: 150,
        backgroundColor: "#fff",
        borderRadius: 100,
        marginBottom: 20,
    },
    mainText: {
        fontSize: 20,
        color: "white",
        textAlign: "center",
        marginHorizontal: 20,
        marginTop: 10,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
        color: "#FFFDD0",
        marginTop: 20,
        paddingHorizontal: 30,
        textAlign: "center",
    },
    floatingNote: {
        position: "absolute",
    },
    emoji: {
        fontSize: 24,
        color: "white",
    },
});

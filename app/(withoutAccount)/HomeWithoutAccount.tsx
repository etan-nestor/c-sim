import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import NavbarNa from '../components/NavbarNa';
import Card from '../components/Card';
import TabNavigationNa from '../components/TabNavigationNa';
import { db } from '../../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const getImageForCategory = (category: string) => {
    const images: Record<string, any> = {
        enfants: require("../../assets/images/enfants.png"),
        femmes: require("../../assets/images/femme.png"),
        jeunesse: require("../../assets/images/jeunesse.png"),
        groupe_musical: require("../../assets/images/musical.png"),
        ensemble: require("../../assets/images/ensemble.png"),
        leçon: require("../../assets/images/pray.png"),
    };
    return images[category] || require("../../assets/images/default.png");
};

const HomeWithoutAccount = () => {
    const router = useRouter();

    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true); // 👈 State loading
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            setLoading(true); // 👈 Commencer le chargement
            const songSnapshot = await getDocs(collection(db, 'songs'));
            const lessonSnapshot = await getDocs(collection(db, 'lessons'));

            const categoriesSet = new Set<string>();

            songSnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.catégorie) {
                    categoriesSet.add(data.catégorie);
                }
            });

            lessonSnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.catégorie) {
                    categoriesSet.add(data.catégorie);
                }
            });

            setCategories(Array.from(categoriesSet));
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories: ", error);
        } finally {
            setLoading(false); // 👈 Fin du chargement
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCategoryPress = (category: string) => {
        if (['enfants', 'femmes', 'jeunesse','ensemble'].includes(category)) {
            router.push({
                pathname: '/SongListScreen',
                params: { category },
            });
        } else {
            setSelectedCategory(category);
            setModalVisible(true);
        }
    };

    const handleTypeSelection = (type: string) => {
        setModalVisible(false);

        if (selectedCategory === 'leçon') {
            router.push({
                pathname: '/LessonListScreen',
                params: { type },
            });
        } else if (selectedCategory) {
            const languageParam = 'français';
            router.push({
                pathname: '/SongListScreen',
                params: { category: selectedCategory, type, language: languageParam },
            });
        }
    };

    return (
        <View style={styles.container}>
            <NavbarNa />
            <Text style={styles.title}>Chantons pour Dieu</Text>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator color="#F86C1B" size={50} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.cardContainer}>
                    {categories.map((category) => (
                        <TouchableOpacity key={category} onPress={() => handleCategoryPress(category)}>
                            <Card
                                imageSource={getImageForCategory(category)}
                                title={category.charAt(0).toUpperCase() + category.slice(1)}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            <TabNavigationNa />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Choisissez un type</Text>
                        {selectedCategory && typeOptions[selectedCategory]?.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={styles.typeButton}
                                onPress={() => handleTypeSelection(type)}
                            >
                                <Text style={styles.typeButtonText}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Annuler</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        color: "#F86C1B",
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#F86C1B',
    },
    typeButton: {
        backgroundColor: '#F86C1B',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    typeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
        textTransform: 'capitalize',
    },
    cancelButton: {
        marginTop: 10,
        alignSelf: 'center',
    },
    cancelText: {
        color: '#888',
        fontSize: 14,
    },
});

const typeOptions: Record<string, string[]> = {
    groupe_musical: ['louange', 'adoration'],
    ensemble: ['louange', 'adoration'],
    leçon: ['enseignement', 'prières', 'versets'],
};

export default HomeWithoutAccount;

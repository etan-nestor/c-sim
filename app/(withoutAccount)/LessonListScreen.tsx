// screens/LessonListScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import LessonList from '../components/LessonList';
import SelectLanguage from '../components/SelectLanguage';  // Un composant pour sélectionner la langue
import SearchBar from '../components/SearchBar';  // Un composant pour la barre de recherche
import NavbarNa from '../components/NavbarNa';
import TabNavigationNa from '../components/TabNavigationNa';

const LessonListScreen = () => {
    const { type } = useLocalSearchParams();  // Récupère le type de leçon (enseignement, prières, versets)
    
    const [selectedLanguage, setSelectedLanguage] = useState<string>('français');
    const [searchText, setSearchText] = useState<string>('');

    return (
        <>
            <NavbarNa />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.category}>{type}</Text>
                    <SelectLanguage
                        selectedLanguage={selectedLanguage}
                        onLanguageChange={setSelectedLanguage}
                    />
                </View>

                <SearchBar
                    searchText={searchText}
                    onSearchChange={setSearchText}
                />

                <LessonList
                    type={type as string}
                    languageFilter={selectedLanguage}
                    searchText={searchText}
                />
            </View>
            <TabNavigationNa />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 14,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    category: {
        fontSize: 14,
        backgroundColor: '#6CE20B',
        fontWeight: 'bold',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 10,
        textTransform: "capitalize",
        color: "#070707",
    },
});

export default LessonListScreen;

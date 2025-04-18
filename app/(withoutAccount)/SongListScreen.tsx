import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import SongList from '../components/SongList';
import SelectLanguage from '../components/SelectLanguage';
import NavbarNa from '../components/NavbarNa';
import TabNavigationNa from '../components/TabNavigationNa';
import SearchBar from '../components/SearchBar';

const SongListScreen = () => {
    const { category, type, language } = useLocalSearchParams();
    
    // S'assurer que `language` est une string
    const languageParam = Array.isArray(language) ? language[0] : language || 'français';  // Utilisation de 'français' comme valeur par défaut

    const [selectedLanguage, setSelectedLanguage] = useState(languageParam);
    const [searchText, setSearchText] = useState<string>("");

    return (
        <>
            <NavbarNa />
            <View style={styles.container}>
                {/* En-tête avec la catégorie et le filtre de langue */}
                <View style={styles.header}>
                    <Text style={styles.category}>{category}</Text>
                    <SelectLanguage
                        selectedLanguage={selectedLanguage}
                        onLanguageChange={setSelectedLanguage}
                    />
                </View>

                {/* Recherche */}
                <SearchBar
                    searchText={searchText}
                    onSearchChange={setSearchText}
                />

                {/* Liste des chansons */}
                <SongList 
                    category={category as string} 
                    type={type as string} 
                    language={selectedLanguage} 
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

export default SongListScreen;

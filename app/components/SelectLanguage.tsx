import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface SelectLanguageProps {
    selectedLanguage: string;
    onLanguageChange: (language: string) => void;
}

const languages = ["français", "anglais", "moore", "gourtmanche", "autres"];

// Modification du type de languageLabels pour permettre un accès par string
const languageLabels: { [key: string]: string } = {
    "français": "Français",
    "anglais": "Anglais",
    "moore": "Moore",
    "gourtmanche": "Gourtmanche",
    "autres": "Autres"
};

const SelectLanguage: React.FC<SelectLanguageProps> = ({ selectedLanguage, onLanguageChange }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{languageLabels[selectedLanguage]}</Text>
            <Picker
                selectedValue={selectedLanguage}
                onValueChange={(value) => onLanguageChange(value)}
                style={styles.picker}
            >
                {languages.map((lang) => (
                    <Picker.Item key={lang} label={languageLabels[lang]} value={lang} />
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        width:250,
        borderRadius: 8,
        paddingHorizontal: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginRight: 16,
        color: "#333",
    },
    picker: {
        flex: 1,
        height: 35,
        borderRadius: 8,
        backgroundColor: "#07C5BC",
    },
});

export default SelectLanguage;

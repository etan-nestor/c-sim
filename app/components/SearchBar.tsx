import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
    searchText: string;
    onSearchChange: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchText, onSearchChange }) => {
    return (
        <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par titre ou numéro"
            value={searchText}
            onChangeText={onSearchChange}
        />
    );
};

const styles = StyleSheet.create({
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 8,
    },
});

export default SearchBar;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ListCardProps {
    number: string;
    title: string;
}

const ListCard: React.FC<ListCardProps> = ({ number, title }) => {
    return (
        <View style={styles.card}>
            <View style={styles.numberContainer}>
                <Text style={styles.number}>{number}</Text>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                    {title}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    numberContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F86C1B',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    number: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    titleContainer: {
        flex: 1, // <- c'est ça qui limite et ajuste l'espace
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        flexShrink: 1, // au cas où il y a encore du débordement
    },
});

export default ListCard;

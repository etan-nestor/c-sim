import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface CardProps {
    imageSource: any; // Le résultat de require() (numéro)
    title: string;
}

const Card: React.FC<CardProps> = ({ imageSource, title }) => {
    return (
        <View style={styles.card}>
            <Image source={imageSource} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 145,
        height: 180,
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "orangered",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    cardImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    cardTitle: {
        fontWeight: "bold",
    },
});

export default Card;

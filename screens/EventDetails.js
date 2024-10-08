import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { useNavigation } from '@react-navigation/native';

const EventDetails = ({ route }) => {
    const { event } = route.params;
    const navigation = useNavigation(); 

    const handleLocationPress = () => {
        navigation.navigate('Maps', { destination: event.location });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <Icon name="arrow-left" size={20} color="white" />
            </TouchableOpacity>
            <View style={styles.containerdes}>
                <Text style={styles.title}>{event.objectif}</Text>
                <Text style={styles.description}>{event.description}</Text>
                {/* L'image est supprimée de cette version */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.details}>Date: {event.date}</Text>
                    <Text style={styles.details}>Heure: {event.heure}</Text>
                    <Text style={styles.details}>Durée: {event.duree}</Text>
                    <TouchableOpacity onPress={handleLocationPress}>
                        <View style={styles.row}>
                            <Text style={styles.details}>Lieu: {event.location} <Icon name="map-marker" size={20} color="blue" /></Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.details}>Personnes concernées: {event.peuple}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    description: {
        fontSize: 18,
        marginBottom: 20,
        color: '#555',
    },
    detailsContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        elevation: 3,
    },
    details: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    backButton: {
        backgroundColor: '#4285F4',
        padding: 10,
        borderRadius: 10,
        position: 'absolute',
        top: 20,
        left: 20,
        marginTop: 30,
        zIndex: 1,
    },
    containerdes: {
        marginTop: 100,
        alignItems: 'center'
    },
});

export default EventDetails;

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import { random } from 'lodash';
import useAuth from '../hooks/useAuth';

const EventList = ({ navigation }) => {
    const [eventData, setEventData] = useState([]);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const eventCollection = collection(db, 'events');
                const querySnapshot = await getDocs(eventCollection);
                const events = querySnapshot.docs.map((doc, index) => ({
                    id: doc.id,
                    ...doc.data(),
                    color: randomColor(),
                }));
                setEventData(events);
            } catch (error) {
                console.error('Error fetching events', error);
            }
        };

        fetchEventData();
    }, []);

    const randomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await deleteDoc(doc(db, 'events', eventId));
            setEventData(prevEvents => prevEvents.filter(event => event.id !== eventId));
        } catch (error) {
            console.error('Error deleting event', error);
        }
    };

    const { user } = useAuth();
    const userEmail = user ? user.email : '';
    const isAdmin = userEmail === 'tarik.i482@ucd.ac.ma';

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { event: item })}>
                <View style={[styles.eventItem, { backgroundColor: item.color }]}>
                    <Text numberOfLines={1} style={styles.eventText}>{item.objectif}</Text>
                    <Text style={styles.eventText}>{item.date}</Text>
                    {isAdmin ? (
                        <TouchableOpacity onPress={() => handleDeleteEvent(item.id)}>
                            <FontAwesome name="trash" size={24} color="black" />
                        </TouchableOpacity>
                    ): null}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={eventData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.eventList}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    eventList: {
        flex: 1,
        width: '100%',
    },
    eventItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eventText: {
        flex: 1,
        fontSize: 20,
        color: '#000',
        fontVariant: ['tabular-nums'],
        fontWeight: 'bold',
    },
});

export default EventList;

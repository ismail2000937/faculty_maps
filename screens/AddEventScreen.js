import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import * as ImagePicker from 'expo-image-picker'; 

const EventForm = () => {
    const [formData, setFormData] = useState([
        { label: 'Date', value: '', placeholder: 'Entrer la date', key: 'date' },
        { label: 'Durée', value: '', placeholder: 'Entrer la durée', key: 'duree' },
        { label: 'Heure', value: '', placeholder: 'Entrer le temps', key: 'heure' },
        { label: 'Emplacement', value: '', placeholder: 'Entrer location', key: 'location' },
        { label: 'Objectif', value: '', placeholder: 'Entrer objectif', key: 'objectif' },
        { label: 'Cible publique', value: '', placeholder: 'Entrer public concernée', key: 'peuple' },
        { label: 'Description', value: '', placeholder: 'Entrer description', key: 'description' },
        // { label: 'Image', value: '', placeholder: 'Charger image', key: 'image' },
    ]);

    const handleChange = (text, key) => {
        setFormData(prevFormData => {
            const updatedFormData = prevFormData.map(item => {
                if (item.key === key) {
                    return { ...item, value: text };
                }
                return item;
            });
            return updatedFormData;
        });
    };

    const handleSubmit = async () => {
        const isFormFilled = formData.every(item => item.value.trim() !== '');
        if (!isFormFilled) {
            Alert.alert('Error', 'Please remplir tous les champs');
            return;
        }

        try {
            const formDataObject = {};
            formData.forEach(item => {
                formDataObject[item.key] = item.value;
            });

            const docRef = await addDoc(collection(db, 'events'), formDataObject);
            console.log('Document written with ID: ', docRef.id);
            Alert.alert('Success', 'Event submitted successfully');

            setFormData(prevFormData => (
                prevFormData.map(item => ({ ...item, value: '' }))
            ));
        } catch (error) {
            console.error('Error adding document: ', error);
            Alert.alert('Error', 'Failed to submit event');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ajouter un event</Text>
            <FlatList
                data={formData}
                renderItem={({ item }) => (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{item.label} :</Text>
                        <TextInput
                            style={styles.input}
                            value={item.value}
                            onChangeText={text => handleChange(text, item.key)}
                            placeholder={item.placeholder}
                        />
                    </View>
                )}
                keyExtractor={item => item.key}
            />
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default EventForm;

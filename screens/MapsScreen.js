import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GOOGLE_MAPS_API_KEY } from '../config/configKey';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function MapsScreen() {
    const [originDestination, setOriginDestination] = useState({});
    const [destination, setDestination] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [isSearchCompleted, setIsSearchCompleted] = useState(false);
    const [listVisible, setListVisible] = useState(false);
    const [markersData, setMarkersData] = useState([]);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        let locationSubscription;

        const fetchInitialData = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.error("Location permission not granted");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            const markersCollectionRef = collection(db, 'markers');
            const markersSnapshot = await getDocs(markersCollectionRef);
            const markersList = markersSnapshot.docs.map(doc => doc.data());
            setMarkersData(markersList);
        };

        fetchInitialData();

        // Subscribe to location updates
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                locationSubscription = Location.watchPositionAsync(
                    { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1 },
                    locationChanged
                );
            }
        })();

        return () => {
            if (locationSubscription && locationSubscription.remove) {
                locationSubscription.remove();
            }
        };
    }, []);

    const locationChanged = (location) => {
        setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
    };

    useEffect(() => {
        const filtered = markersData.filter(item =>
            item.title && item.title.toLowerCase().includes(searchQuery ? searchQuery.toLowerCase() : "")
        );
        setFilteredData(filtered);
        setIsSearchCompleted(true);
    }, [searchQuery, markersData]);

    const handleDestinationSelection = (item) => {
        setDestination({
            latitude: item.latitude,
            longitude: item.longitude
        });
        setListVisible(false);
        mapRef.current.animateToRegion({
            latitude: item.latitude,
            longitude: item.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        }, 1000);
    };

    const handleSearchInputChange = (text) => {
        setSearchQuery(text);
        setListVisible(text !== "");
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    onChangeText={handleSearchInputChange}
                    value={searchQuery}
                />
            </View>
            {isSearchCompleted && listVisible && (
                <FlatList
                    style={styles.list}
                    data={filteredData}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleDestinationSelection(item)} style={styles.itemContainer}>
                            <Text style={styles.item}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id.toString()}
                />
            )}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                ref={mapRef}
                mapType='hybrid'
                initialRegion={{
                    latitude: 33.2253524,
                    longitude: -8.486183,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                onPress={(event) => setDestination(event.nativeEvent.coordinate)}
            >
                {originDestination.origin && <Marker coordinate={originDestination.origin} pinColor="green" />}
                {destination && <Marker coordinate={destination} pinColor="red" />}
                {markersData.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        title={marker.title}
                        description={marker.description}
                        pinColor="#04718a"
                    />
                ))}
                {userLocation && (
                    <Marker
                        coordinate={userLocation}
                        title="Votre position"
                        pinColor="blue"
                    />
                )}
                {userLocation && destination && (
                    <MapViewDirections
                        origin={userLocation}
                        destination={destination}
                        strokeWidth={5}
                        apikey={GOOGLE_MAPS_API_KEY}
                        strokeColor='rgba(12, 248, 138, 0.9)'
                        mode='WALKING'
                        onReady={result => {
                            setDistance(result.distance);
                            setDuration(result.duration);
                        }}
                    />
                )}
            </MapView>
            <View style={styles.infoContainer}>
                {distance && <Text>Distance: {distance.toFixed(2)} km</Text>}
                {duration && <Text>Durée: {duration.toFixed(2)} minutes</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        marginBottom: 20,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    list: {
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    itemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9',
    },
    item: {
        paddingVertical: 15,
        fontSize: 16,
        color: '#333',
    },
    map: {
        flex: 1,
    },
    infoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

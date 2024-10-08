import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import EventDetails from './EventDetails';
import EventList from './EventList';
import MapsScreen from './MapsScreen';
import DetailsScreen from './DetailsScreen';
import AddEventScreen from './AddEventScreen';
import useAuth from '../hooks/useAuth';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  const { user } = useAuth();
  const userEmail = user ? user.email : ''; 
  const isAdmin = userEmail === 'tarik.i482@ucd.ac.ma';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'home') {
            iconName = 'home';
          } else if (route.name === 'Maps') {
            iconName = 'map';
          } else if (route.name === 'AddEvent' && isAdmin) {
            iconName = 'plus';
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          } else {
            iconName = 'alert-circle'; 
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
        },
      })}
    >
      <Tab.Screen name="home" component={HomeSection} options={{ headerShown: false }} />
      <Tab.Screen name="Maps" component={MapsScreen} options={{ headerShown: false }} />
      {isAdmin ? <Tab.Screen name="AddEvent" component={AddEventScreen} options={{ headerShown: false }} /> : null}
      <Tab.Screen name="Settings" component={DetailsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const HomeSection = () => {
  return (
    <Stack.Navigator initialRouteName='EventList'>
      <Stack.Screen name="EventDetails" component={EventDetails} options={{ headerShown: false }} />
      <Stack.Screen name="EventList" component={EventList} />
    </Stack.Navigator>
  );
};

export default HomeScreen;

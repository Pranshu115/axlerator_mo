import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import BrowseTrucksScreen from './src/screens/BrowseTrucksScreen';
import SellTruckScreen from './src/screens/SellTruckScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import TruckDetailScreen from './src/screens/TruckDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="TruckDetail" component={TruckDetailScreen} />
    </Stack.Navigator>
  );
}

function BrowseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BrowseMain" component={BrowseTrucksScreen} />
      <Stack.Screen name="TruckDetail" component={TruckDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Browse') {
                iconName = focused ? 'search' : 'search-outline';
              } else if (route.name === 'Sell') {
                iconName = focused ? 'add-circle' : 'add-circle-outline';
              } else if (route.name === 'Services') {
                iconName = focused ? 'person' : 'person-outline';
              } else {
                iconName = 'ellipse-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2563eb',
            tabBarInactiveTintColor: '#6b7280',
            headerShown: false,
            tabBarStyle: {
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Browse" component={BrowseStack} />
          <Tab.Screen name="Sell" component={SellTruckScreen} />
          <Tab.Screen name="Services" component={ServicesScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

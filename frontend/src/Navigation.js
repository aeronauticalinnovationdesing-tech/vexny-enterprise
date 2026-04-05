import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

// Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import FlightPlanningScreen from '../screens/FlightPlanningScreen';
import DroneManagementScreen from '../screens/DroneManagementScreen';
import FlightHistoryScreen from '../screens/FlightHistoryScreen';
import WeatherScreen from '../screens/WeatherScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = ({ userId }) => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ title: 'Inicio' }}
      initialParams={{ userId }}
    />
  </Stack.Navigator>
);

const FlightStack = ({ userId }) => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="FlightHistory"
      component={FlightHistoryScreen}
      options={{ title: 'Historial de Vuelos' }}
      initialParams={{ userId }}
    />
    <Stack.Screen
      name="FlightPlanning"
      component={FlightPlanningScreen}
      options={{ title: 'Planificar Vuelo' }}
      initialParams={{ userId }}
    />
  </Stack.Navigator>
);

const DroneStack = ({ userId }) => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="DroneManagement"
      component={DroneManagementScreen}
      options={{ title: 'Gestionar Drones' }}
      initialParams={{ userId }}
    />
  </Stack.Navigator>
);

const WeatherStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="WeatherMain"
      component={WeatherScreen}
      options={{ title: 'Clima y Regulaciones' }}
    />
  </Stack.Navigator>
);

const AppTabs = ({ userId }) => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#0066cc',
      tabBarInactiveTintColor: '#999',
    }}
  >
    <Tab.Screen
      name="Home"
      children={() => <HomeStack userId={userId} />}
      options={{
        tabBarLabel: 'Inicio',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
      }}
    />
    <Tab.Screen
      name="Flights"
      children={() => <FlightStack userId={userId} />}
      options={{
        tabBarLabel: 'Vuelos',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>✈️</Text>,
      }}
    />
    <Tab.Screen
      name="Drones"
      children={() => <DroneStack userId={userId} />}
      options={{
        tabBarLabel: 'Drones',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🚁</Text>,
      }}
    />
    <Tab.Screen
      name="Weather"
      component={WeatherStack}
      options={{
        tabBarLabel: 'Clima',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🌤️</Text>,
      }}
    />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const { isSignedIn, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isSignedIn && user ? (
        <AppTabs userId={user.id} />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;

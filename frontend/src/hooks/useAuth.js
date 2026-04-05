import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/apiService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('authToken');
      const savedUser = await AsyncStorage.getItem('currentUser');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to restore session', e);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await apiService.registerPilot(userData);
      setToken(response.token);
      setUser(response.pilot);
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('currentUser', JSON.stringify(response.pilot));
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await apiService.loginPilot(email, password);
      setToken(response.token);
      setUser(response.pilot);
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('currentUser', JSON.stringify(response.pilot));
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiService.logout();
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    token,
    isLoading,
    register,
    login,
    logout,
    isSignedIn: !!token,
  };
};

export const useDrones = (pilotId) => {
  const [drones, setDrones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDrones = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getPilotDrones(pilotId);
      setDrones(data);
    } catch (err) {
      setError(err.message || 'Error fetching drones');
    } finally {
      setIsLoading(false);
    }
  };

  const addDrone = async (droneData) => {
    try {
      const newDrone = await apiService.createDrone(droneData);
      setDrones([...drones, newDrone.drone]);
      return newDrone;
    } catch (err) {
      setError(err.message || 'Error creating drone');
      throw err;
    }
  };

  useEffect(() => {
    if (pilotId) {
      getDrones();
    }
  }, [pilotId]);

  return { drones, isLoading, error, addDrone, refetch: getDrones };
};

export const useFlights = (pilotId) => {
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFlights = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getPilotFlights(pilotId);
      setFlights(data);
    } catch (err) {
      setError(err.message || 'Error fetching flights');
    } finally {
      setIsLoading(false);
    }
  };

  const addFlight = async (flightData) => {
    try {
      const newFlight = await apiService.createFlightPlan(flightData);
      setFlights([newFlight.flight, ...flights]);
      return newFlight;
    } catch (err) {
      setError(err.message || 'Error creating flight');
      throw err;
    }
  };

  useEffect(() => {
    if (pilotId) {
      getFlights();
    }
  }, [pilotId]);

  return { flights, isLoading, error, addFlight, refetch: getFlights };
};

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.API_BASE_URL || 'http://192.168.1.100:5000/api';

class ApiService {
  constructor() {
    this.token = null;
    this.loadToken();
  }

  async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Auth endpoints
  async registerPilot(pilotData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/pilots/register`,
        pilotData
      );
      if (response.data.token) {
        this.token = response.data.token;
        await AsyncStorage.setItem('authToken', this.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async loginPilot(email, password) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/pilots/login`,
        { email, password }
      );
      if (response.data.token) {
        this.token = response.data.token;
        await AsyncStorage.setItem('authToken', this.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getPilotProfile(pilotId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/pilots/profile/${pilotId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Drone endpoints
  async createDrone(droneData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/drones`,
        droneData,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getPilotDrones(pilotId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/drones/pilot/${pilotId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateDroneStatus(droneId, status) {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/drones/${droneId}/status`,
        { status },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Flight endpoints
  async createFlightPlan(flightData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/flights`,
        flightData,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getPilotFlights(pilotId, limit = 20, offset = 0) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/flights/pilot/${pilotId}`,
        {
          params: { limit, offset },
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateFlightStatus(flightId, status, telemetryData = null) {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/flights/${flightId}/status`,
        { status, telemetryData },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getFlightStatistics(pilotId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/flights/stats/${pilotId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Weather endpoints
  async getCurrentWeather(latitude, longitude) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/weather/current/${latitude}/${longitude}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getWeatherForecast(latitude, longitude) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/weather/forecast/${latitude}/${longitude}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Airspace endpoints
  async getAirspaceRestrictions(latitude, longitude) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/airspace/restrictions/${latitude}/${longitude}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getNearbyRegulations(latitude, longitude, radius = 5000) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/airspace/regulations/${latitude}/${longitude}/${radius}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async logout() {
    this.token = null;
    await AsyncStorage.removeItem('authToken');
  }
}

export default new ApiService();

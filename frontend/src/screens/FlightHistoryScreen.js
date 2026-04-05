import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import apiService from '../services/apiService';

const FlightHistoryScreen = ({ route }) => {
  const [flights, setFlights] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadFlights();
    const unsubscribe = navigation.addListener('focus', () => {
      loadFlights();
    });
    return unsubscribe;
  }, []);

  const loadFlights = async () => {
    try {
      setIsLoading(true);
      const flightsData = await apiService.getPilotFlights(route.params?.userId);
      setFlights(flightsData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los vuelos');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'in-flight':
        return '#2196F3';
      case 'planned':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const renderFlightCard = ({ item }) => (
    <TouchableOpacity style={styles.flightCard}>
      <View>
        <Text style={styles.flightName}>{item.flight_name}</Text>
        <Text style={styles.flightLocation}>{item.launch_location}</Text>
        <View style={styles.flightDetails}>
          <Text style={styles.detail}>📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text>
          <Text style={styles.detail}>⬆️ {item.altitude}m</Text>
          <Text style={styles.detail}>⏱️ {item.duration}min</Text>
          <Text style={styles.detail}>📏 {item.distance}m</Text>
        </View>
      </View>

      <View style={styles.statusBadge}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        />
        <Text style={styles.statusText}>
          {item.status === 'planned'
            ? 'Planificado'
            : item.status === 'in-flight'
            ? 'En Vuelo'
            : item.status === 'completed'
            ? 'Completado'
            : 'Cancelado'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Vuelos</Text>
        <Text style={styles.subtitle}>Total: {flights.length} vuelos</Text>
      </View>

      {flights.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay vuelos registrados</Text>
        </View>
      ) : (
        <FlatList
          data={flights}
          keyExtractor={(item) => item.id}
          renderItem={renderFlightCard}
          contentContainerStyle={styles.flightsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0066cc',
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  flightsList: {
    padding: 16,
  },
  flightCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  flightName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  flightLocation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  flightDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detail: {
    fontSize: 11,
    color: '#666',
    marginRight: 12,
    marginBottom: 4,
  },
  statusBadge: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default FlightHistoryScreen;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import apiService from '../services/apiService';

const HomeScreen = ({ navigation, route }) => {
  const [user, setUser] = React.useState(null);
  const [stats, setStats] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadUserData();
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await apiService.getPilotProfile(route.params?.userId);
      setUser(userData);

      if (route.params?.userId) {
        const statistics = await apiService.getFlightStatistics(route.params.userId);
        setStats(statistics);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Bienvenido, {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.subtitle}>Licencia: {user?.licenseNumber}</Text>
      </View>

      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Estadísticas de Vuelos</Text>

          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.total_flights || 0}</Text>
              <Text style={styles.statLabel}>Vuelos Total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.completed_flights || 0}</Text>
              <Text style={styles.statLabel}>Completados</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {Math.round((stats.total_distance || 0) / 1000)} km
              </Text>
              <Text style={styles.statLabel}>Distancia Total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{Math.round(stats.max_altitude || 0)}m</Text>
              <Text style={styles.statLabel}>Altitud Máx</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('FlightPlanning')}
        >
          <Text style={styles.actionButtonText}>📋 Planificar Vuelo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('DroneManagement')}
        >
          <Text style={styles.actionButtonText}>🚁 Gestionar Drones</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('FlightHistory')}
        >
          <Text style={styles.actionButtonText}>📊 Historial de Vuelos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Weather')}
        >
          <Text style={styles.actionButtonText}>🌤️ Clima y Regulaciones</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0066cc',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statsContainer: {
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  quickActions: {
    padding: 16,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default HomeScreen;

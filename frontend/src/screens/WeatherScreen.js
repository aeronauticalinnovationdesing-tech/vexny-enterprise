import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import apiService from '../services/apiService';

const WeatherScreen = () => {
  const [latitude, setLatitude] = React.useState('40.7128');
  const [longitude, setLongitude] = React.useState('-74.0060');
  const [currentWeather, setCurrentWeather] = React.useState(null);
  const [forecast, setForecast] = React.useState(null);
  const [restrictions, setRestrictions] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('weather');

  const handleGetWeather = async () => {
    if (!latitude || !longitude) {
      Alert.alert('Error', 'Por favor ingresa coordenadas');
      return;
    }

    try {
      setIsLoading(true);
      const [weatherData, forecastData, rulesData] = await Promise.all([
        apiService.getCurrentWeather(latitude, longitude),
        apiService.getWeatherForecast(latitude, longitude),
        apiService.getAirspaceRestrictions(latitude, longitude),
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setRestrictions(rulesData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clima y Regulaciones</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Coordenadas</Text>
        <View style={styles.coordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Latitud"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="decimal-pad"
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Longitud"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="decimal-pad"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleGetWeather}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>🔍 Obtener Información</Text>
          )}
        </TouchableOpacity>
      </View>

      {(currentWeather || forecast || restrictions) && (
        <>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'weather' && styles.activeTab]}
              onPress={() => setActiveTab('weather')}
            >
              <Text style={styles.tabText}>Clima</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'rules' && styles.activeTab]}
              onPress={() => setActiveTab('rules')}
            >
              <Text style={styles.tabText}>Regulaciones</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'weather' && currentWeather && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Clima Actual</Text>

              <View style={styles.weatherCard}>
                <View style={styles.weatherMain}>
                  <Text style={styles.weatherEmoji}>🌡️</Text>
                  <View>
                    <Text style={styles.temperature}>{currentWeather.temperature}°C</Text>
                    <Text style={styles.description}>{currentWeather.description}</Text>
                  </View>
                </View>

                <View style={styles.weatherDetails}>
                  <View style={styles.weatherDetail}>
                    <Text style={styles.weatherLabel}>Sensación térmica</Text>
                    <Text style={styles.weatherValue}>{currentWeather.feelsLike}°C</Text>
                  </View>
                  <View style={styles.weatherDetail}>
                    <Text style={styles.weatherLabel}>Humedad</Text>
                    <Text style={styles.weatherValue}>{currentWeather.humidity}%</Text>
                  </View>
                  <View style={styles.weatherDetail}>
                    <Text style={styles.weatherLabel}>Viento</Text>
                    <Text style={styles.weatherValue}>{currentWeather.windSpeed} m/s</Text>
                  </View>
                  <View style={styles.weatherDetail}>
                    <Text style={styles.weatherLabel}>Visibilidad</Text>
                    <Text style={styles.weatherValue}>{(currentWeather.visibility / 1000).toFixed(1)} km</Text>
                  </View>
                </View>
              </View>

              {forecast && (
                <View style={styles.forecastContainer}>
                  <Text style={styles.sectionSubtitle}>Pronóstico (5 días)</Text>
                  {forecast.forecast.slice(0, 5).map((item, index) => (
                    <View key={index} style={styles.forecastItem}>
                      <Text style={styles.forecastTime}>
                        {new Date(item.timestamp).toLocaleString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                      <Text style={styles.forecastTemp}>{item.temperature}°C</Text>
                      <Text style={styles.forecastDesc}>{item.description}</Text>
                      <Text style={styles.forecastWind}>{item.windSpeed} m/s</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {activeTab === 'rules' && restrictions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Regulaciones Aéreas</Text>

              <View style={[
                styles.rulesCard,
                restrictions.canFly ? styles.canFly : styles.cannotFly,
              ]}>
                <Text style={styles.rulesTitle}>
                  {restrictions.canFly ? '✅ PUEDES VOLAR' : '⛔ NO se PERMITE VOLAR'}
                </Text>
              </View>

              {restrictions.noPlyZones && restrictions.noPlyZones.length > 0 && (
                <View style={styles.restrictionGroup}>
                  <Text style={styles.restrictionTitle}>Zonas de No Vuelo</Text>
                  {restrictions.noPlyZones.map((zone) => (
                    <View key={zone.id} style={styles.restrictionItem}>
                      <Text style={styles.restrictionName}>{zone.name}</Text>
                      <Text style={styles.restrictionType}>{zone.type}</Text>
                      <Text style={styles.restrictionRadius}>
                        Radio: {zone.radius}m | Altitud Máx: {zone.maxAltitude}m
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {restrictions.restrictedAirspaces && restrictions.restrictedAirspaces.length > 0 && (
                <View style={styles.restrictionGroup}>
                  <Text style={styles.restrictionTitle}>Espacios Aéreos Restringidos</Text>
                  {restrictions.restrictedAirspaces.map((zone) => (
                    <View key={zone.id} style={styles.restrictionItem}>
                      <Text style={styles.restrictionName}>{zone.name}</Text>
                      <Text style={styles.restrictionRadius}>
                        Radio: {zone.radius}m | Altitud Máx: {zone.maxAltitude}m
                      </Text>
                      <Text style={styles.permissionRequired}>
                        {zone.requiresPermission ? '📋 Requiere Permiso' : 'Sin restricción'}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {restrictions.restrictions && restrictions.restrictions.length === 0 && (
                <Text style={styles.noRestrictionsText}>
                  No hay restricciones de vuelo en esta área
                </Text>
              )}
            </View>
          )}
        </>
      )}
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
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  coordContainer: {
    flexDirection: 'row',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0066cc',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  temperature: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  weatherDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weatherDetail: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
  },
  weatherLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  weatherValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  forecastContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  forecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  forecastTime: {
    flex: 1,
    fontSize: 12,
    color: '#666',
  },
  forecastTemp: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0066cc',
  },
  forecastDesc: {
    flex: 1,
    fontSize: 12,
    color: '#999',
  },
  forecastWind: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  rulesCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  canFly: {
    backgroundColor: '#E8F5E9',
  },
  cannotFly: {
    backgroundColor: '#FFEBEE',
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  restrictionGroup: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  restrictionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  restrictionItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    paddingLeft: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  restrictionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  restrictionType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  restrictionRadius: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  permissionRequired: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
  },
  noRestrictionsText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
});

export default WeatherScreen;

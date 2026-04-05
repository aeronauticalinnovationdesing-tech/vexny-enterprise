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

const FlightPlanningScreen = ({ route, navigation }) => {
  const [formData, setFormData] = React.useState({
    flightName: '',
    launchLocation: '',
    latitude: '',
    longitude: '',
    altitude: '50',
    duration: '30',
    purpose: 'surveillance',
  });
  const [drones, setDrones] = React.useState([]);
  const [selectedDrone, setSelectedDrone] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingDrones, setIsLoadingDrones] = React.useState(true);

  React.useEffect(() => {
    loadDrones();
  }, []);

  const loadDrones = async () => {
    try {
      setIsLoadingDrones(true);
      const dronesData = await apiService.getPilotDrones(route.params?.userId);
      setDrones(dronesData);
      if (dronesData.length > 0) {
        setSelectedDrone(dronesData[0].id);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los drones');
    } finally {
      setIsLoadingDrones(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.flightName || !formData.latitude || !formData.longitude) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (!selectedDrone) {
      Alert.alert('Error', 'Selecciona un dron');
      return;
    }

    try {
      setIsLoading(true);
      const flightData = {
        pilotId: route.params?.userId,
        droneId: selectedDrone,
        ...formData,
        altitude: parseInt(formData.altitude),
        duration: parseInt(formData.duration),
      };

      await apiService.createFlightPlan(flightData);
      Alert.alert('Éxito', 'Plan de vuelo creado correctamente');
      setFormData({
        flightName: '',
        launchLocation: '',
        latitude: '',
        longitude: '',
        altitude: '50',
        duration: '30',
        purpose: 'surveillance',
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Error creando el plan de vuelo');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingDrones) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Planificar Nuevo Vuelo</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Nombre del Vuelo *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Inspección de puente"
          value={formData.flightName}
          onChangeText={(text) => handleInputChange('flightName', text)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Seleccionar Dron *</Text>
        {drones.length > 0 ? (
          <View>
            {drones.map((drone) => (
              <TouchableOpacity
                key={drone.id}
                style={[
                  styles.droneOption,
                  selectedDrone === drone.id && styles.droneOptionSelected,
                ]}
                onPress={() => setSelectedDrone(drone.id)}
              >
                <Text style={styles.droneText}>
                  {drone.manufacturer} {drone.model} ({drone.serial_number})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>No hay drones disponibles</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Ubicación de Lanzamiento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Parque Central"
          value={formData.launchLocation}
          onChangeText={(text) => handleInputChange('launchLocation', text)}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Latitud *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 40.7128"
            value={formData.latitude}
            onChangeText={(text) => handleInputChange('latitude', text)}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Longitud *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: -74.0060"
            value={formData.longitude}
            onChangeText={(text) => handleInputChange('longitude', text)}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Altitud (m)</Text>
          <TextInput
            style={styles.input}
            value={formData.altitude}
            onChangeText={(text) => handleInputChange('altitude', text)}
            keyboardType="number-pad"
          />
        </View>
        <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Duración (min)</Text>
          <TextInput
            style={styles.input}
            value={formData.duration}
            onChangeText={(text) => handleInputChange('duration', text)}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Propósito</Text>
        <View>
          {['surveillance', 'inspection', 'mapping', 'delivery', 'photography'].map(
            (purpose) => (
              <TouchableOpacity
                key={purpose}
                style={[
                  styles.purposeOption,
                  formData.purpose === purpose && styles.purposeOptionSelected,
                ]}
                onPress={() => handleInputChange('purpose', purpose)}
              >
                <Text style={styles.purposeText}>
                  {purpose.charAt(0).toUpperCase() + purpose.slice(1)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Crear Plan de Vuelo</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  droneOption: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  droneOptionSelected: {
    borderColor: '#0066cc',
    backgroundColor: '#f0f7ff',
  },
  droneText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  purposeOption: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  purposeOptionSelected: {
    backgroundColor: '#0066cc',
  },
  purposeText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  purposeOptionSelected: {
    backgroundColor: '#0066cc',
  },
  noDataText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FlightPlanningScreen;

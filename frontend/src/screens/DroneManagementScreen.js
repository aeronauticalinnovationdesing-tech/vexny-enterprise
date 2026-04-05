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

const DroneManagementScreen = ({ route }) => {
  const [drones, setDrones] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    manufacturer: '',
    model: '',
    serialNumber: '',
    maxAltitude: '400',
    maxDistance: '1000',
    batteryLife: '30',
    weight: '2500',
  });

  React.useEffect(() => {
    loadDrones();
  }, []);

  const loadDrones = async () => {
    try {
      setIsLoading(true);
      const dronesData = await apiService.getPilotDrones(route.params?.userId);
      setDrones(dronesData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los drones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddDrone = async () => {
    if (!formData.manufacturer || !formData.model || !formData.serialNumber) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }

    try {
      setIsLoading(true);
      await apiService.createDrone({
        pilotId: route.params?.userId,
        manufacturer: formData.manufacturer,
        model: formData.model,
        serialNumber: formData.serialNumber,
        maxAltitude: parseInt(formData.maxAltitude),
        maxDistance: parseInt(formData.maxDistance),
        batteryLife: parseInt(formData.batteryLife),
        weight: parseInt(formData.weight),
      });

      Alert.alert('Éxito', 'Dron añadido correctamente');
      setFormData({
        manufacturer: '',
        model: '',
        serialNumber: '',
        maxAltitude: '400',
        maxDistance: '1000',
        batteryLife: '30',
        weight: '2500',
      });
      setShowForm(false);
      await loadDrones();
    } catch (error) {
      Alert.alert('Error', error.message || 'Error añadiendo el dron');
    } finally {
      setIsLoading(false);
    }
  };

  const updateDroneStatus = async (droneId, newStatus) => {
    try {
      await apiService.updateDroneStatus(droneId, newStatus);
      await loadDrones();
      Alert.alert('Éxito', 'Estado del dron actualizado');
    } catch (error) {
      Alert.alert('Error', 'Error actualizando el estado');
    }
  };

  if (isLoading && !showForm) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Drones</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>{showForm ? 'Cancelar' : '➕ Nuevo Dron'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Añadir Nuevo Dron</Text>

          <View style={styles.section}>
            <Text style={styles.label}>Fabricante *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: DJI"
              value={formData.manufacturer}
              onChangeText={(text) => handleInputChange('manufacturer', text)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Modelo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Air 3"
              value={formData.model}
              onChangeText={(text) => handleInputChange('model', text)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Número de Serie *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: ABC123-XYZ"
              value={formData.serialNumber}
              onChangeText={(text) => handleInputChange('serialNumber', text)}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Altitud Máx (m)</Text>
              <TextInput
                style={styles.input}
                value={formData.maxAltitude}
                onChangeText={(text) => handleInputChange('maxAltitude', text)}
                keyboardType="number-pad"
              />
            </View>
            <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Distancia Máx (m)</Text>
              <TextInput
                style={styles.input}
                value={formData.maxDistance}
                onChangeText={(text) => handleInputChange('maxDistance', text)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Duración Batería (min)</Text>
              <TextInput
                style={styles.input}
                value={formData.batteryLife}
                onChangeText={(text) => handleInputChange('batteryLife', text)}
                keyboardType="number-pad"
              />
            </View>
            <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Peso (g)</Text>
              <TextInput
                style={styles.input}
                value={formData.weight}
                onChangeText={(text) => handleInputChange('weight', text)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddDrone}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Añadir Dron</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.dronesList}>
        {drones.length === 0 ? (
          <Text style={styles.emptyText}>No tienes drones registrados</Text>
        ) : (
          drones.map((drone) => (
            <View key={drone.id} style={styles.droneCard}>
              <View>
                <Text style={styles.droneName}>
                  {drone.manufacturer} {drone.model}
                </Text>
                <Text style={styles.droneSerial}>{drone.serial_number}</Text>
                <View style={styles.droneSpecs}>
                  <Text style={styles.spec}>⬆️ {drone.max_altitude}m</Text>
                  <Text style={styles.spec}>↔️ {drone.max_distance}m</Text>
                  <Text style={styles.spec}>🔋 {drone.battery_life}min</Text>
                  <Text style={styles.spec}>⚖️ {drone.weight}g</Text>
                </View>
              </View>

              <View style={styles.statusContainer}>
                <Text
                  style={[
                    styles.status,
                    drone.status === 'active' ? styles.statusActive : styles.statusInactive,
                  ]}
                >
                  {drone.status === 'active' ? '✓ Activo' : '⊗ Inactivo'}
                </Text>
                <TouchableOpacity
                  style={styles.statusButton}
                  onPress={() =>
                    updateDroneStatus(drone.id, drone.status === 'active' ? 'inactive' : 'active')
                  }
                >
                  <Text style={styles.statusButtonText}>
                    {drone.status === 'active' ? 'Desactivar' : 'Activar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
    padding: 16,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#0066cc',
    fontWeight: '600',
    fontSize: 12,
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  section: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#0066cc',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  dronesList: {
    padding: 16,
  },
  droneCard: {
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
  droneName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  droneSerial: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  droneSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  spec: {
    fontSize: 11,
    color: '#666',
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginBottom: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusActive: {
    color: '#4CAF50',
  },
  statusInactive: {
    color: '#FF5252',
  },
  statusButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
});

export default DroneManagementScreen;

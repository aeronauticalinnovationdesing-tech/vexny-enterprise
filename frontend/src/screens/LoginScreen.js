import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';

const LoginScreen = ({ navigation }) => {
  const { login, isLoading, register } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLogin, setIsLogin] = React.useState(true);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [licenseNumber, setLicenseNumber] = React.useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa los campos');
      return;
    }

    try {
      const response = await login(email, password);
      navigation.replace('Main', { userId: response.pilot.id });
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    try {
      const response = await register({
        email,
        password,
        firstName,
        lastName,
        licenseNumber,
      });
      navigation.replace('Main', { userId: response.pilot.id });
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al registrarse');
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>🚁</Text>
          <Text style={styles.appName}>Drone Pilot App</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={firstName}
                onChangeText={setFirstName}
                editable={!isLoading}
              />
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={lastName}
                onChangeText={setLastName}
                editable={!isLoading}
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Número de Licencia"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              editable={!isLoading}
            />
          )}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={isLogin ? handleLogin : handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setIsLogin(!isLogin)}
            disabled={isLoading}
          >
            <Text style={styles.toggleText}>
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Características</Text>
          <Text style={styles.feature}>✅ Planificación de vuelos</Text>
          <Text style={styles.feature}>✅ Gestión de drones</Text>
          <Text style={styles.feature}>✅ Clima en tiempo real</Text>
          <Text style={styles.feature}>✅ Regulaciones aéreas</Text>
          <Text style={styles.feature}>✅ Historial de vuelos</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#0066cc',
    padding: 30,
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  form: {
    padding: 20,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '500',
  },
  features: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  feature: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
});

export default LoginScreen;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postRequest } from '../scripts/utils';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tryToLogin, setTryToLogin] = useState(false);
  const [isCredentialValid, setIsCredentialValid] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const response = await postRequest('/auth/login', { email, password });
    console.log('Response: ', response);
    if (response.token) {
      setIsCredentialValid(true);
      AsyncStorage.setItem('token', response.token);
      router.navigate('./(tabs)');
    } else {
      setTryToLogin(true);
      setTimeout(() => {
        setTryToLogin(false);
      }, 1500)
    }
  };

  const goToRegister = () => {
    router.navigate('./register');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />

      <Text style={{ marginTop: 20, textAlign: 'center', color: 'gray' }}>
        {email && password ? 'Ready to login.' : 'Please fill in all fields.'}
      </Text>
      {tryToLogin && <Text style={styles.floatBox}>
        {isCredentialValid ? 'Login Successfull.' : 'Wrong username or password.'}
      </Text>}

      <TouchableOpacity style={styles.addButton} onPress={handleLogin}>
        <Text style={styles.addButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={goToRegister}>
        <Text style={styles.addButtonText}>Sign Up</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  floatBox: {
    position: 'absolute',
    backgroundColor: 'white',
    marginHorizontal: 'auto',
    fontSize: 24,
    padding: 20,
    borderWidth: 2,
    borderRadius: 5,
    textAlign: 'center',
    color: 'gray',
    transitionDelay: '0.8s',
  }
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { postRequest } from '../../scripts/utils';

export default function RegisterScreen() {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tryToRegister, setTryToRegister] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const goToLogin = () => {
    router.navigate('../login');
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setTryToRegister(true);
      setMessage('Passwords do not match');
      setTimeout(() => {
        setTryToRegister(false);
      }, 1500)
      return;
    }

    const response = await postRequest('/auth/register', { username, email, password });
    console.log('Message: ', response.message);
    goToLogin();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>

      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setName}
        placeholder="Enter your name"
      />
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
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm your password"
        secureTextEntry
      />

      <Text style={{ marginTop: 20, textAlign: 'center', color: 'gray' }}>
        {username && email && password && confirmPassword ? 'Ready to Register.' : 'Please fill in all fields.'}
      </Text>

      {tryToRegister && <Text style={styles.floatBox}>
        {message}
      </Text>}

      <TouchableOpacity style={styles.addButton} onPress={handleRegister}>
        <Text style={styles.addButtonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={goToLogin}>
        <Text style={styles.addButtonText}>Login</Text>
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

// src/screens/SignupScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function SignupScreen({ navigation }) { // Add navigation to the component props
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const auth = getAuth();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home'); // Navigate to Home screen
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignup} />
      {error ? <Text>{error}</Text> : null}
    </View>
  );
}

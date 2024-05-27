import React from 'react';
import { View, Text, Button } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate('Signup');
    });
  };

  return (
    <View>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

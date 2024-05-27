import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebaseConfig'; // Import Firebase config

export default function HomeScreen({ navigation }) {
  const auth = getAuth(app);
  const db = getDatabase(app);
  const [userName, setUserName] = useState('');

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate('Signup');
    });
  };

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = ref(db, 'users/' + auth.currentUser.uid);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserName(data.username);
        }
      });
    }
  }, [auth.currentUser]);

  return (
    <View>
      <Text>Welcome to the Home Screen, {userName}!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

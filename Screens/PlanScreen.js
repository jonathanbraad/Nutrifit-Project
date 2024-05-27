import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { app } from '../firebaseConfig';

export default function PlanScreen({ navigation }) {
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [error, setError] = useState('');

  const auth = getAuth(app);
  const db = getDatabase(app);

  const handleSavePlan = async () => {
    if (!calories || !protein || !carbs || !fats) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const user = auth.currentUser;
      await set(ref(db, 'plans/' + user.uid), {
        calories: parseInt(calories),
        protein: parseInt(protein),
        carbs: parseInt(carbs),
        fats: parseInt(fats),
      });
      navigation.navigate('Home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Plan</Text>
      <TextInput
        style={styles.input}
        placeholder="Calories"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Protein (g)"
        value={protein}
        onChangeText={setProtein}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Carbs (g)"
        value={carbs}
        onChangeText={setCarbs}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Fats (g)"
        value={fats}
        onChangeText={setFats}
        keyboardType="numeric"
      />
      <Button title="Save Plan" onPress={handleSavePlan} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: '100%',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

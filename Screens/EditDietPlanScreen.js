import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, update, onValue } from 'firebase/database';
import { app } from '../firebaseConfig';

export default function UpdateDietPlanScreen({ navigation }) {
  const auth = getAuth(app);
  const db = getDatabase(app);
  const [caloriesEaten, setCaloriesEaten] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (auth.currentUser) {
      const dietProgressRef = ref(db, 'users/' + auth.currentUser.uid + '/dietProgress');
      onValue(dietProgressRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCaloriesEaten(data.caloriesEaten.toString());
          setProtein(data.protein.toString());
          setCarbs(data.carbs.toString());
          setFats(data.fats.toString());
        }
      });
    }
  }, [auth.currentUser]);

  const handleUpdatePlan = async () => {
    if (!caloriesEaten || !protein || !carbs || !fats) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const user = auth.currentUser;
      const dietProgressRef = ref(db, 'users/' + user.uid + '/dietProgress');
      await update(dietProgressRef, {
        caloriesEaten: parseInt(caloriesEaten),
        protein: parseInt(protein),
        carbs: parseInt(carbs),
        fats: parseInt(fats),
      });
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error updating diet progress:', error);
      setError(error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Update Your Diet Progress</Text>
          <TextInput
            style={styles.input}
            placeholder="Calories Eaten"
            value={caloriesEaten}
            onChangeText={setCaloriesEaten}
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
          <Button title="Update Progress" onPress={handleUpdatePlan} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

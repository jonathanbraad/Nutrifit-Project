// src/screens/EditWorkoutPlanScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, update, onValue } from 'firebase/database';
import { app } from '../firebaseConfig';

export default function EditWorkoutPlanScreen({ navigation }) {
  const auth = getAuth(app);
  const db = getDatabase(app);
  const [workoutsCompleted, setWorkoutsCompleted] = useState('');
  const [cardioDone, setCardioDone] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (auth.currentUser) {
      const workoutProgressRef = ref(db, 'users/' + auth.currentUser.uid + '/workoutProgress');
      onValue(workoutProgressRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setWorkoutsCompleted(data.workoutsCompleted.toString());
          setCardioDone(data.cardioDone.toString());
          setCaloriesBurned(data.caloriesBurned.toString());
        }
      });
    }
  }, [auth.currentUser]);

  const handleUpdateWorkoutProgress = async () => {
    if (!workoutsCompleted || !cardioDone || !caloriesBurned) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const user = auth.currentUser;
      const workoutProgressRef = ref(db, 'users/' + user.uid + '/workoutProgress');
      await update(workoutProgressRef, {
        workoutsCompleted: parseInt(workoutsCompleted),
        cardioDone: parseInt(cardioDone),
        caloriesBurned: parseInt(caloriesBurned),
      });
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error updating workout progress:', error);
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Your Workout Progress</Text>
      <TextInput
        style={styles.input}
        placeholder="Workouts Completed"
        value={workoutsCompleted}
        onChangeText={setWorkoutsCompleted}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Cardio Done (minutes)"
        value={cardioDone}
        onChangeText={setCardioDone}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Calories Burned"
        value={caloriesBurned}
        onChangeText={setCaloriesBurned}
        keyboardType="numeric"
      />
      <Button title="Update Workout Progress" onPress={handleUpdateWorkoutProgress} />
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

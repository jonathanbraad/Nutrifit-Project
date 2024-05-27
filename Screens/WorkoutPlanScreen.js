import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, push, get, update } from 'firebase/database';
import { app } from '../firebaseConfig';

export default function WorkoutPlanScreen({ navigation }) {
  const [exercises, setExercises] = useState([]);
  const [exerciseName, setExerciseName] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState('');

  const auth = getAuth(app);
  const db = getDatabase(app);

  const handleAddExercise = () => {
    if (!exerciseName || !reps) {
      setError('Please fill in all fields');
      return;
    }
    const newExercise = { exercise: exerciseName, reps: parseInt(reps) };
    setExercises([...exercises, newExercise]);
    setExerciseName('');
    setReps('');
    setError('');
  };

  const handleSavePlan = async () => {
    if (exercises.length === 0) {
      setError('Please add at least one exercise');
      return;
    }

    try {
      const user = auth.currentUser;
      const userRef = ref(db, 'users/' + user.uid);
      const plansRef = ref(db, 'plans/' + user.uid);

      const snapshot = await get(plansRef);
      const plansData = snapshot.val() || {};
      const planCount = Object.keys(plansData).length;

      const planRef = push(plansRef);
      const planID = planRef.key;

      await set(planRef, {
        type: 'workout',
        order: planCount + 1,
        exercises: exercises,
        userID: user.uid,
      });

      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      if (!userData.activeWorkoutPlan) {
        await update(userRef, { activeWorkoutPlan: planID });
      }

      const userPlans = userData.planIDs ? userData.planIDs : [];
      userPlans.push(planID);

      await update(userRef, { planIDs: userPlans });

      navigation.navigate('Home');
    } catch (error) {
      console.error('Error creating plan:', error);
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Workout Plan</Text>
      <TextInput
        style={styles.input}
        placeholder="Exercise Name"
        value={exerciseName}
        onChangeText={setExerciseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Reps"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
      />
      <Button title="Add Exercise" onPress={handleAddExercise} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={exercises}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.exerciseItem}>
            <Text>{item.exercise}: {item.reps} reps</Text>
          </View>
        )}
      />
      <Button title="Save Plan" onPress={handleSavePlan} />
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
  exerciseItem: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
});

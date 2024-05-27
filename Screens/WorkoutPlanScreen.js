import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, push, get, update } from 'firebase/database';
import { app } from '../firebaseConfig';

export default function WorkoutPlanScreen({ navigation }) {
  const [exercise, setExercise] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState('');

  const auth = getAuth(app);
  const db = getDatabase(app);

  const handleSavePlan = async () => {
    if (!exercise || !reps) {
      setError('Please fill in all fields');
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
        exercise,
        reps: parseInt(reps),
        userID: user.uid,
      });

      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      if (!userData.activePlan) {
        await update(userRef, { activePlan: planID });
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
        placeholder="Exercise"
        value={exercise}
        onChangeText={setExercise}
      />
      <TextInput
        style={styles.input}
        placeholder="Reps"
        value={reps}
        onChangeText={setReps}
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

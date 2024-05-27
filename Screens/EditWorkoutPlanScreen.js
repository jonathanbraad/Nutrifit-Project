import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, FlatList } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, update, onValue, get } from 'firebase/database';
import { app } from '../firebaseConfig';

export default function EditWorkoutPlanScreen({ navigation }) {
  const auth = getAuth(app);
  const db = getDatabase(app);
  const [workoutsCompleted, setWorkoutsCompleted] = useState('');
  const [cardioDone, setCardioDone] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (auth.currentUser) {
      const workoutProgressRef = ref(db, 'users/' + auth.currentUser.uid + '/workoutProgress');
      onValue(workoutProgressRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setWorkoutsCompleted(data.workoutsCompleted?.toString() || '0');
          setCardioDone(data.cardioDone?.toString() || '0');
          setCaloriesBurned(data.caloriesBurned?.toString() || '0');
        }
      });

      const activeWorkoutPlanRef = ref(db, 'users/' + auth.currentUser.uid + '/activeWorkoutPlan');
      onValue(activeWorkoutPlanRef, (snapshot) => {
        const activeWorkoutPlanID = snapshot.val();
        if (activeWorkoutPlanID) {
          const planRef = ref(db, 'plans/' + auth.currentUser.uid + '/' + activeWorkoutPlanID);
          onValue(planRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.exercises) {
              const exercisesWithProgress = data.exercises.map(exercise => ({
                ...exercise,
                progress: exercise.progress || 0,
              }));
              setExercises(exercisesWithProgress);
            }
          });
        }
      });
    }
  }, [auth.currentUser]);

  const handleUpdateWorkoutProgress = async () => {
    try {
      const user = auth.currentUser;
      const workoutProgressRef = ref(db, 'users/' + user.uid + '/workoutProgress');
      await update(workoutProgressRef, {
        workoutsCompleted: workoutsCompleted ? parseInt(workoutsCompleted) : 0,
        cardioDone: cardioDone ? parseInt(cardioDone) : 0,
        caloriesBurned: caloriesBurned ? parseInt(caloriesBurned) : 0,
      });

      const activeWorkoutPlanRef = ref(db, 'users/' + user.uid + '/activeWorkoutPlan');
      const activeWorkoutPlanID = await get(activeWorkoutPlanRef).then(snapshot => snapshot.val());
      if (activeWorkoutPlanID) {
        const planRef = ref(db, 'plans/' + user.uid + '/' + activeWorkoutPlanID);
        await update(planRef, {
          exercises: exercises,
        });
      }

      navigation.navigate('Home');
    } catch (error) {
      console.error('Error updating workout progress:', error);
      setError(error.message);
    }
  };

  const incrementExerciseProgress = (index) => {
    const updatedExercises = [...exercises];
    updatedExercises[index].progress += 1;
    setExercises(updatedExercises);
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
      <FlatList
        data={exercises}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.exerciseItem}>
            <Text style={styles.exerciseText}>{item.exercise}: {item.reps} reps: {item.kilos} kg</Text>
            <Text style={styles.exerciseText}>Progress: {item.progress} reps</Text>
            <Button title="Add 1 Rep" onPress={() => incrementExerciseProgress(index)} />
          </View>
        )}
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
  exerciseItem: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  exerciseText: {
    fontSize: 16,
  },
});

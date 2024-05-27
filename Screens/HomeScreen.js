import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebaseConfig';

export default function HomeScreen({ navigation }) {
  const auth = getAuth(app);
  const db = getDatabase(app);
  const [userName, setUserName] = useState('');
  const [activeDietPlan, setActiveDietPlan] = useState(null);
  const [activeWorkoutPlan, setActiveWorkoutPlan] = useState(null);
  const [dietProgress, setDietProgress] = useState({
    caloriesEaten: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [workoutProgress, setWorkoutProgress] = useState({
    workoutsCompleted: 0,
    cardioDone: 0,
    caloriesBurned: 0,
  });

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate('Login');
    });
  };

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = ref(db, 'users/' + auth.currentUser.uid);
      const activeDietPlanRef = ref(db, 'users/' + auth.currentUser.uid + '/activeDietPlan');
      const activeWorkoutPlanRef = ref(db, 'users/' + auth.currentUser.uid + '/activeWorkoutPlan');

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserName(data.username);
        }
      });

      onValue(activeDietPlanRef, (snapshot) => {
        const activeDietPlanID = snapshot.val();
        if (activeDietPlanID) {
          const planRef = ref(db, 'plans/' + auth.currentUser.uid + '/' + activeDietPlanID);
          onValue(planRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              setActiveDietPlan(data);
            }
          });
        }
      });

      onValue(activeWorkoutPlanRef, (snapshot) => {
        const activeWorkoutPlanID = snapshot.val();
        if (activeWorkoutPlanID) {
          const planRef = ref(db, 'plans/' + auth.currentUser.uid + '/' + activeWorkoutPlanID);
          onValue(planRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              setActiveWorkoutPlan(data);
            }
          });
        }
      });
    }
  }, [auth.currentUser]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NutriFit</Text>
        <Button title="Log Out" onPress={handleLogout} />
      </View>
      <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
      <Button title="Create Plan" onPress={() => navigation.navigate('PlanSelection')} />
      <Button title="Manage Plans" onPress={() => navigation.navigate('ManagePlans')} />
      <View style={styles.plansContainer}>
        {activeDietPlan && (
          <View style={styles.progressSection}>
            <Text style={styles.planOrderText}>Active Diet Plan</Text>
            <Text style={styles.progressText}>Calories: {dietProgress.caloriesEaten} / {activeDietPlan.calories}</Text>
            <Text style={styles.progressText}>Protein: {dietProgress.protein}g / {activeDietPlan.protein}g</Text>
            <Text style={styles.progressText}>Carbs: {dietProgress.carbs}g / {activeDietPlan.carbs}g</Text>
            <Text style={styles.progressText}>Fats: {dietProgress.fats}g / {activeDietPlan.fats}g</Text>
          </View>
        )}
        {activeWorkoutPlan && (
          <View style={styles.progressSection}>
            <Text style={styles.planOrderText}>Active Workout Plan</Text>
            {activeWorkoutPlan.exercises.map((exercise, index) => (
              <Text key={index} style={styles.progressText}>{exercise.exercise}: {exercise.reps} reps</Text>
            ))}
            <Text style={styles.progressText}>Workouts completed: {workoutProgress.workoutsCompleted}</Text>
            <Text style={styles.progressText}>Cardio done: {workoutProgress.cardioDone} minutes</Text>
            <Text style={styles.progressText}>Calories burned: {workoutProgress.caloriesBurned}</Text>
          </View>
        )}
      </View>
      <View style={styles.progressBarContainer}>
        <Text style={styles.progressBarText}>Progress bars/Goals:</Text>
        <View style={styles.progressBar}>
          <View style={styles.progress}></View>
        </View>
        <Text style={styles.progressGoalText}>Cardio goal: 60/120 minutes completed</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressSection: {
    width: '48%',
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  planOrderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 16,
    marginBottom: 10,
  },
  progressBarContainer: {
    marginTop: 20,
  },
  progressBarText: {
    fontSize: 16,
    marginBottom: 10,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    width: '50%',
    backgroundColor: '#4caf50',
  },
  progressGoalText: {
    marginTop: 10,
    textAlign: 'center',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  navItem: {
    alignItems: 'center',
  },
});

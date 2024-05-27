import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebaseConfig';

export default function HomeScreen({ navigation }) {
  const auth = getAuth(app);
  const db = getDatabase(app);
  const [userName, setUserName] = useState('');
  const [activePlan, setActivePlan] = useState(null);
  const [progress, setProgress] = useState({
    caloriesEaten: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [planOrder, setPlanOrder] = useState(null);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate('Login');
    });
  };

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = ref(db, 'users/' + auth.currentUser.uid);
      const activePlanRef = ref(db, 'users/' + auth.currentUser.uid + '/activePlan');

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserName(data.username);
        }
      });

      onValue(activePlanRef, (snapshot) => {
        const activePlanID = snapshot.val();
        if (activePlanID) {
          const planRef = ref(db, 'plans/' + auth.currentUser.uid + '/' + activePlanID);
          onValue(planRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              setActivePlan(data);
              setPlanOrder(data.order);
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
      {activePlan && (
        <View style={styles.progressContainer}>
          <View style={styles.progressSection}>
            <Text style={styles.planOrderText}>Plan {planOrder}</Text>
            <Text style={styles.progressText}>Calories: {progress.caloriesEaten} / {activePlan.calories}</Text>
            <Text style={styles.progressText}>Protein: {progress.protein}g / {activePlan.protein}g</Text>
            <Text style={styles.progressText}>Carbs: {progress.carbs}g / {activePlan.carbs}g</Text>
            <Text style={styles.progressText}>Fats: {progress.fats}g / {activePlan.fats}g</Text>
          </View>
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>Workouts completed: ###</Text>
            <Text style={styles.progressText}>Cardio done: ###</Text>
            <Text style={styles.progressText}>Calories burned: ###</Text>
          </View>
        </View>
      )}
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressSection: {
    width: '48%',
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 10,
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

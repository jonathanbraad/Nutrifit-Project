import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebaseConfig';

export default function HomeScreen({ navigation }) {
  const auth = getAuth(app);
  const db = getDatabase(app);
  const [userName, setUserName] = useState('');
  const [userPlan, setUserPlan] = useState(null);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate('Login');
    });
  };

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = ref(db, 'users/' + auth.currentUser.uid);
      const planRef = ref(db, 'plans/' + auth.currentUser.uid);
      
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserName(data.username);
        }
      });
      
      onValue(planRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserPlan(data);
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
      {userPlan && (
        <View style={styles.planContainer}>
          <Text style={styles.planText}>Calories: {userPlan.calories}</Text>
          <Text style={styles.planText}>Protein: {userPlan.protein}g</Text>
          <Text style={styles.planText}>Carbs: {userPlan.carbs}g</Text>
          <Text style={styles.planText}>Fats: {userPlan.fats}g</Text>
        </View>
      )}
      <Button title="Create/Edit Plan" onPress={() => navigation.navigate('Plan')} />
      <View style={styles.progressContainer}>
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>Calories eaten: ###</Text>
          <Text style={styles.progressText}>Protein: ###</Text>
          <Text style={styles.progressText}>Calories eaten: ###</Text>
          <Text style={styles.progressText}>Calories eaten: ###</Text>
          <Text style={styles.progressText}>Calories eaten: ###</Text>
        </View>
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>Workouts completed: ###</Text>
          <Text style={styles.progressText}>Cardio done: ###</Text>
          <Text style={styles.progressText}>Calories burned: ###</Text>
        </View>
      </View>
      <View style={styles.progressBarContainer}>
        <Text style={styles.progressBarText}>Progress bars/Goals:</Text>
        <View style={styles.progressBar}>
          <View style={styles.progress}></View>
        </View>
        <Text style={styles.progressGoalText}>Cardio goal: 60/120 minutes completed</Text>
      </View>
      <View style={styles.navbar}>
        <View style={styles.navItem}>
          <Text>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Text>Planning</Text>
        </View>
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
  planContainer: {
    marginBottom: 20,
  },
  planText: {
    fontSize: 18,
    marginBottom: 10,
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

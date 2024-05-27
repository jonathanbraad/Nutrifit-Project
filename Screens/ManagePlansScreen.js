import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, remove, update, get } from 'firebase/database';
import { app } from '../firebaseConfig';

export default function ManagePlansScreen({ navigation }) {
  const [dietPlans, setDietPlans] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [activeDietPlan, setActiveDietPlan] = useState(null);
  const [activeWorkoutPlan, setActiveWorkoutPlan] = useState(null);
  const [activeDietPlanID, setActiveDietPlanID] = useState(null);
  const [activeWorkoutPlanID, setActiveWorkoutPlanID] = useState(null);
  const auth = getAuth(app);
  const db = getDatabase(app);

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = ref(db, 'users/' + auth.currentUser.uid);
      const plansRef = ref(db, 'plans/' + auth.currentUser.uid);

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setActiveDietPlanID(data.activeDietPlan);
        setActiveWorkoutPlanID(data.activeWorkoutPlan);
      });

      onValue(plansRef, (snapshot) => {
        const data = snapshot.val() || {};
        const dietPlansList = [];
        const workoutPlansList = [];

        Object.keys(data).forEach(key => {
          const plan = { id: key, ...data[key] };
          if (plan.type === 'diet') {
            dietPlansList.push(plan);
          } else if (plan.type === 'workout') {
            workoutPlansList.push(plan);
          }
        });

        dietPlansList.sort((a, b) => a.order - b.order);
        workoutPlansList.sort((a, b) => a.order - b.order);

        setDietPlans(dietPlansList);
        setWorkoutPlans(workoutPlansList);
      });
    }
  }, [auth.currentUser]);

  const handleDeletePlan = async (planID, type) => {
    try {
      await remove(ref(db, 'plans/' + auth.currentUser.uid + '/' + planID));
      if (type === 'diet' && planID === activeDietPlanID) {
        setActiveDietPlan(null);
        setActiveDietPlanID(null);
        await update(ref(db, 'users/' + auth.currentUser.uid), { activeDietPlan: null });
      } else if (type === 'workout' && planID === activeWorkoutPlanID) {
        setActiveWorkoutPlan(null);
        setActiveWorkoutPlanID(null);
        await update(ref(db, 'users/' + auth.currentUser.uid), { activeWorkoutPlan: null });
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleSetActivePlan = async (planID, type) => {
    try {
      if (type === 'diet') {
        await update(ref(db, 'users/' + auth.currentUser.uid), { activeDietPlan: planID });
        const planRef = ref(db, 'plans/' + auth.currentUser.uid + '/' + planID);
        const planSnapshot = await get(planRef);
        if (planSnapshot.exists()) {
          const planData = planSnapshot.val();
          setActiveDietPlan(planData);
          setActiveDietPlanID(planID);
        }
      } else if (type === 'workout') {
        await update(ref(db, 'users/' + auth.currentUser.uid), { activeWorkoutPlan: planID });
        const planRef = ref(db, 'plans/' + auth.currentUser.uid + '/' + planID);
        const planSnapshot = await get(planRef);
        if (planSnapshot.exists()) {
          const planData = planSnapshot.val();
          setActiveWorkoutPlan(planData);
          setActiveWorkoutPlanID(planID);
        }
      }
    } catch (error) {
      console.error('Error setting active plan:', error);
    }
  };

  const renderPlanItem = ({ item }) => (
    <View style={[styles.planItem, (item.id === activeDietPlanID || item.id === activeWorkoutPlanID) && styles.activePlan]}>
      <Text style={styles.planText}>Plan {item.order}</Text>
      {item.type === 'diet' ? (
        <>
          <Text style={styles.planText}>Calories: {item.calories}</Text>
          <Text style={styles.planText}>Protein: {item.protein}g</Text>
          <Text style={styles.planText}>Carbs: {item.carbs}g</Text>
          <Text style={styles.planText}>Fats: {item.fats}g</Text>
        </>
      ) : (
        item.exercises && item.exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseItem}>
            <Text style={styles.planText}>{exercise.exercise}: {exercise.reps} reps</Text>
            <Text style={styles.planText}>Progress: {exercise.progress || 0} reps</Text>
          </View>
        ))
      )}
      <View style={styles.planButtons}>
        <Button title="Set Active" onPress={() => handleSetActivePlan(item.id, item.type)} />
        <Button title="Delete" onPress={() => handleDeletePlan(item.id, item.type)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Your Plans</Text>
      <View style={styles.plansContainer}>
        <View style={styles.planList}>
          <Text style={styles.listTitle}>Diet Plans</Text>
          <FlatList
            data={dietPlans}
            keyExtractor={item => item.id}
            renderItem={renderPlanItem}
          />
        </View>
        <View style={styles.planList}>
          <Text style={styles.listTitle}>Workout Plans</Text>
          <FlatList
            data={workoutPlans}
            keyExtractor={item => item.id}
            renderItem={renderPlanItem}
          />
        </View>
      </View>
      <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
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
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  planList: {
    width: '48%',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  planItem: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  activePlan: {
    backgroundColor: '#a0d3ff', // Change color to highlight the active plan
  },
  planText: {
    fontSize: 16,
    marginBottom: 5,
  },
  exerciseItem: {
    marginBottom: 10,
  },
  planButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

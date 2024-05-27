import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { app } from '../firebaseConfig';

export default function ManagePlansScreen({ navigation }) {
  const [dietPlans, setDietPlans] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [activeDietPlan, setActiveDietPlan] = useState(null);
  const [activeWorkoutPlan, setActiveWorkoutPlan] = useState(null);
  const auth = getAuth(app);
  const db = getDatabase(app);

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = ref(db, 'users/' + auth.currentUser.uid);
      const plansRef = ref(db, 'plans/' + auth.currentUser.uid);

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setActiveDietPlan(data.activeDietPlan);
        setActiveWorkoutPlan(data.activeWorkoutPlan);
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
    await remove(ref(db, 'plans/' + auth.currentUser.uid + '/' + planID));
    if (type === 'diet' && planID === activeDietPlan) {
      setActiveDietPlan(null);
      await update(ref(db, 'users/' + auth.currentUser.uid), { activeDietPlan: null });
    } else if (type === 'workout' && planID === activeWorkoutPlan) {
      setActiveWorkoutPlan(null);
      await update(ref(db, 'users/' + auth.currentUser.uid), { activeWorkoutPlan: null });
    }
  };

  const handleSetActivePlan = async (planID, type) => {
    if (type === 'diet') {
      setActiveDietPlan(planID);
      await update(ref(db, 'users/' + auth.currentUser.uid), { activeDietPlan: planID });
    } else if (type === 'workout') {
      setActiveWorkoutPlan(planID);
      await update(ref(db, 'users/' + auth.currentUser.uid), { activeWorkoutPlan: planID });
    }
  };

  const renderPlanItem = ({ item }) => (
    <View style={[styles.planItem, (item.id === activeDietPlan || item.id === activeWorkoutPlan) && styles.activePlan]}>
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
          <Text key={index} style={styles.planText}>{exercise.exercise}: {exercise.reps} reps</Text>
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
  planButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { app } from '../firebaseConfig';

export default function ManagePlansScreen({ navigation }) {
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const auth = getAuth(app);
  const db = getDatabase(app);

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = ref(db, 'users/' + auth.currentUser.uid + '/activePlan');
      const plansRef = ref(db, 'plans/' + auth.currentUser.uid);

      onValue(userRef, (snapshot) => {
        setActivePlan(snapshot.val());
      });

      onValue(plansRef, (snapshot) => {
        const data = snapshot.val() || {};
        const plansList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        plansList.sort((a, b) => a.order - b.order); // Sort by order
        setPlans(plansList);
      });
    }
  }, [auth.currentUser]);

  const handleDeletePlan = async (planID) => {
    await remove(ref(db, 'plans/' + auth.currentUser.uid + '/' + planID));
    if (planID === activePlan) {
      setActivePlan(null);
      await update(ref(db, 'users/' + auth.currentUser.uid), { activePlan: null });
    }

    const userRef = ref(db, 'users/' + auth.currentUser.uid);
    const snapshot = await onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      const updatedPlanIDs = data.planIDs.filter(id => id !== planID);
      update(userRef, { planIDs: updatedPlanIDs });
    });
  };

  const handleSetActivePlan = async (planID) => {
    setActivePlan(planID);
    await update(ref(db, 'users/' + auth.currentUser.uid), { activePlan: planID });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Your Plans</Text>
      <FlatList
        data={plans}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.planItem, item.id === activePlan && styles.activePlan]}>
            <Text style={styles.planText}>Plan {item.order}</Text>
            <Text style={styles.planText}>Calories: {item.calories}</Text>
            <Text style={styles.planText}>Protein: {item.protein}g</Text>
            <Text style={styles.planText}>Carbs: {item.carbs}g</Text>
            <Text style={styles.planText}>Fats: {item.fats}g</Text>
            <View style={styles.planButtons}>
              <Button title="Set Active" onPress={() => handleSetActivePlan(item.id)} />
              <Button title="Delete" onPress={() => handleDeletePlan(item.id)} />
            </View>
          </View>
        )}
      />
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
  planItem: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
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

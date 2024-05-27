import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, push, get, update } from 'firebase/database';
import { app } from '../firebaseConfig';

export default function PlanScreen({ navigation }) {
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [error, setError] = useState('');

  const auth = getAuth(app);
  const db = getDatabase(app);

  const handleSavePlan = async () => {
    if (!calories || !protein || !carbs || !fats) {
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
        type: 'diet', // Ensure the plan is identified as a diet plan
        order: planCount + 1,
        calories: parseInt(calories),
        protein: parseInt(protein),
        carbs: parseInt(carbs),
        fats: parseInt(fats),
        userID: user.uid,
      });

      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      if (!userData.activeDietPlan) {
        await update(userRef, { activeDietPlan: planID });
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
      <Text style={styles.title}>Create Your Diet Plan</Text>
      <TextInput
        style={styles.input}
        placeholder="Calories"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Protein (g)"
        value={protein}
        onChangeText={setProtein}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Carbs (g)"
        value={carbs}
        onChangeText={setCarbs}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Fats (g)"
        value={fats}
        onChangeText={setFats}
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

import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function PlanSelectionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Create Diet Plan" onPress={() => navigation.navigate('DietPlan')} />
      <Button title="Create Workout Plan" onPress={() => navigation.navigate('WorkoutPlan')} />
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
});

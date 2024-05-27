import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function PlanSelectionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Create new Diet Plan" onPress={() => navigation.navigate('DietPlan')} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Create new Workout Plan" onPress={() => navigation.navigate('WorkoutPlan')} />
        </View>
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
});

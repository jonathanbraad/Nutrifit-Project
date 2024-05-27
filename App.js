import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import './firebaseConfig'; // Import Firebase config
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SignupScreen from './Screens/SignupScreen';
import HomeScreen from './Screens/HomeScreen';
import LoginScreen from './Screens/LoginScreen'; // Import LoginScreen
import DietPlanScreen from './Screens/DietPlanScreen'; // Renamed from PlanScreen
import WorkoutPlanScreen from './Screens/WorkoutPlanScreen'; // New screen
import ManagePlansScreen from './Screens/ManagePlansScreen';
import PlanSelectionScreen from './Screens/PlanSelectionScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ManagePlans" component={ManagePlansScreen} />
        <Stack.Screen name="DietPlan" component={DietPlanScreen} />
        <Stack.Screen name="WorkoutPlan" component={WorkoutPlanScreen} />
        <Stack.Screen name="PlanSelection" component={PlanSelectionScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

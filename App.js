import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "./src/screens/DashboardScreen";
import SubjectDetailsScreen from "./src/screens/SubjectDetailsScreen";
import EligibilityCheckScreen from "./src/screens/EligibilityCheckScreen";
import ResultScreen from "./src/screens/ResultScreen";
import PlannerScreen from "./src/screens/PlannerScreen";
import ScheduleScreen from "./src/screens/ScheduleScreen";
import StatsScreen from "./src/screens/StatsScreen";
import AlertsScreen from "./src/screens/AlertsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false, // Hide default header on all screens
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
        <Stack.Screen name="Alerts" component={AlertsScreen} />
        <Stack.Screen name="SubjectDetails" component={SubjectDetailsScreen} />
        <Stack.Screen name="EligibilityCheck" component={EligibilityCheckScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Planner" component={PlannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

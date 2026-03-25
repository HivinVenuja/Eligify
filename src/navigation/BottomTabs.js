import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigationState } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomTabs({ navigation }) {
  const tabs = [
    { name: "Overview", icon: "grid-outline", activeIcon: "grid", route: "Dashboard" },
    { name: "Schedule", icon: "calendar-outline", activeIcon: "calendar", route: "Schedule" },
    { name: "Stats", icon: "bar-chart-outline", activeIcon: "bar-chart", route: "Stats" },
    { name: "Alerts", icon: "notifications-outline", activeIcon: "notifications", route: "Alerts" },
  ];

  // Get the current route name from navigation state
  // This finds the first main tab screen in the navigation stack
  const routeName = useNavigationState((state) => {
    if (!state) return "Dashboard";
    
    // List of main tab routes
    const mainTabRoutes = ["Dashboard", "Schedule", "Stats", "Alerts"];
    
    // Check all routes in the stack to find the first main tab route
    for (let i = state.routes.length - 1; i >= 0; i--) {
      const route = state.routes[i];
      if (mainTabRoutes.includes(route.name)) {
        return route.name;
      }
    }
    
    // If no main tab route found, return the current route or default to Dashboard
    const currentRoute = state.routes[state.index];
    return currentRoute?.name || "Dashboard";
  });

  const handleTabPress = (route) => {
    // If already on the target route, do nothing
    if (routeName === route) {
      return;
    }
    
    // For tab navigation, reset the stack to the selected tab screen
    // This ensures we don't have detail screens in the stack when switching tabs
    navigation.reset({
      index: 0,
      routes: [{ name: route }],
    });
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isActive = routeName === tab.route;
        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => handleTabPress(tab.route)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={24}
              color={isActive ? "#2563EB" : "#6B7280"}
            />
            <Text style={[styles.tabLabel, { color: isActive ? "#2563EB" : "#6B7280" }]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 4,
  },
});

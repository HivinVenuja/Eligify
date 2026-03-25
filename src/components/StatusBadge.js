import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StatusBadge({ status }) {
  // Map status to match UI design
  const statusText = 
    status === "Eligible" ? "ELIGIBLE" :
    status === "At Risk" ? "AT RISK" :
    "NOT ELIGIBLE";

  const bg =
    status === "Eligible" ? "#10B981" : // Green
    status === "At Risk" ? "#F59E0B" : // Orange
    "#EF4444"; // Red

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.text}>{statusText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { 
    alignSelf: "flex-start", 
    paddingVertical: 2, 
    paddingHorizontal: 6, 
    borderRadius: 3,
  },
  text: { 
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 8,
    letterSpacing: 0.3,
  },
});

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addSubject, loadSubjects } from "../utils/storage";
import BottomTabs from "../navigation/BottomTabs";

export default function ResultScreen({ navigation, route }) {
  const { resultPayload, existingSubjectId } = route.params || {};
  const { subject, attendance, ica, status } = resultPayload;

  const saveToDashboard = async () => {
    // Use existing ID if updating, otherwise create new ID
    const subjectId = existingSubjectId || `${subject.code}-${Date.now()}`;
    
    const savedSubject = {
      id: subjectId,
      name: `${subject.code} - ${subject.name}`,
      status,
      resultPayload, // store full details
    };

    // Check if subject already exists
    const existingSubjects = await loadSubjects();
    const existingIndex = existingSubjects.findIndex(s => s.id === subjectId);
    
    // Save to AsyncStorage (will update if exists, add if new)
    const updatedSubjects = await addSubject(savedSubject);
    
    if (updatedSubjects && updatedSubjects.length > 0) {
      // Navigate to Dashboard with the saved subject
      navigation.navigate("Dashboard", { savedSubject });
      Alert.alert("Success", existingIndex !== -1 ? "Subject updated!" : "Subject saved to dashboard!");
    } else {
      Alert.alert("Error", "Failed to save subject. Please try again.");
    }
  };

  // Determine decision icon and colors
  const isEligible = status === "Eligible";
  const decisionIcon = isEligible ? "checkmark-circle" : "close-circle";
  const decisionColor = isEligible ? "#10B981" : "#EF4444";
  const decisionBg = isEligible ? "#DCFCE7" : "#FEE2E2";

  // Description text based on status
  const getDescription = () => {
    if (status === "Eligible") {
      return "Based on your current semester metrics, you have met the minimum threshold for final eligibility.";
    } else if (status === "At Risk") {
      return "Based on your current semester metrics, you are close to meeting the requirements but need improvement.";
    } else {
      return "Based on your current semester metrics, you have not met the minimum threshold for final eligibility.";
    }
  };

  // Get ICA details
  const icaDetails = [
    { key: "ICA1", name: "ICA1", attended: ica.attended.ICA1, mark: ica.marks.ICA1 },
    { key: "ICA2", name: "ICA2", attended: ica.attended.ICA2, mark: ica.marks.ICA2 },
    { key: "ICA3", name: "ICA3", attended: ica.attended.ICA3, mark: ica.marks.ICA3 },
  ].filter(item => item.attended);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Final Eligibility</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Decision Section */}
        <View style={styles.decisionSection}>
          <View style={[styles.decisionCircle, { backgroundColor: decisionBg }]}>
            <Ionicons name={decisionIcon} size={64} color={decisionColor} />
          </View>
          <View style={[styles.decisionLabel, { backgroundColor: decisionColor }]}>
            <Text style={styles.decisionLabelText}>DECISION</Text>
          </View>
          <Text style={styles.decisionStatus}>{status}</Text>
          <Text style={styles.decisionDescription}>{getDescription()}</Text>
        </View>

        {/* Attendance Breakdown */}
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownHeader}>
            <Text style={[
              styles.breakdownHeaderText,
              { color: attendance.attendancePass ? "#10B981" : "#EF4444" }
            ]}>
              {attendance.attendancePass ? "PASSED" : "FAILED"}
            </Text>
            <Ionicons 
              name="calendar" 
              size={20} 
              color={attendance.attendancePass ? "#10B981" : "#EF4444"} 
            />
          </View>
          <Text style={styles.breakdownTitle}>Attendance Breakdown</Text>
          <Text style={[
            styles.breakdownComparison,
            { color: attendance.attendancePass ? "#10B981" : "#EF4444" }
          ]}>
            {attendance.attendancePercent}% vs {attendance.requiredPercent}% Required
          </Text>
        </View>

        {/* ICA Performance */}
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownHeader}>
            <Text style={[
              styles.breakdownHeaderText,
              { color: ica.icaPass ? "#10B981" : "#6B7280" }
            ]}>
              {ica.icaPass ? "COMPLETE" : "INCOMPLETE"}
            </Text>
            <Ionicons 
              name="bar-chart" 
              size={20} 
              color={ica.icaPass ? "#10B981" : "#6B7280"} 
            />
          </View>
          <Text style={styles.breakdownTitle}>ICA Performance</Text>
          <Text style={styles.breakdownComparison}>
            Attendance: {ica.attendedCount}/3 Sessions
          </Text>

          {/* ICA Details */}
          {icaDetails.map((item) => {
            const mark = Number(item.mark);
            const passed = mark >= 40;
            return (
              <View key={item.key} style={styles.icaItem}>
                <Ionicons 
                  name={passed ? "checkmark-circle" : "alert-circle"} 
                  size={20} 
                  color={passed ? "#10B981" : "#EF4444"} 
                />
                <Text style={styles.icaItemName}>{item.name}</Text>
                <Text style={styles.icaItemScore}>{mark}</Text>
                <View style={[
                  styles.icaBadge,
                  { backgroundColor: passed ? "#DCFCE7" : "#FEE2E2" }
                ]}>
                  <Text style={[
                    styles.icaBadgeText,
                    { color: passed ? "#166534" : "#991B1B" }
                  ]}>
                    {passed ? "PASS" : "FAIL"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("Planner", { resultPayload })}
        >
          <Text style={styles.primaryBtnText}>View Improvement Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={saveToDashboard}>
          <Text style={styles.secondaryText}>Save to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomTabs navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#E0F2FE",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  placeholder: {
    width: 32,
  },
  content: {
    padding: 16,
    paddingTop: 20,
  },
  decisionSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 24,
  },
  decisionCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  decisionLabel: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  decisionLabelText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  decisionStatus: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  decisionDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  breakdownCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  breakdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  breakdownHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  breakdownComparison: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  icaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  icaItemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  icaItemScore: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginRight: 8,
  },
  icaBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  icaBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  primaryBtn: { 
    backgroundColor: "#2563EB", 
    padding: 16, 
    borderRadius: 12, 
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryBtnText: { 
    color: "#FFFFFF", 
    textAlign: "center", 
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryBtn: { 
    padding: 16, 
    borderRadius: 12, 
    marginTop: 12, 
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2563EB",
    backgroundColor: "#FFFFFF",
  },
  secondaryText: { 
    color: "#2563EB", 
    fontWeight: "700",
    fontSize: 16,
  },
});

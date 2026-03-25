import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import BottomTabs from "../navigation/BottomTabs";

export default function PlannerScreen({ navigation, route }) {
  const { resultPayload } = route.params;
  const { subject, attendance, ica, status } = resultPayload;

  // Simulation state
  const [simulatedAttendance, setSimulatedAttendance] = useState(attendance.requiredPercent);
  const [simulatedIcaMark, setSimulatedIcaMark] = useState(42);

  // Attendance guidance
  const missingPercent = Math.max(attendance.requiredPercent - attendance.attendancePercent, 0);
  const attendancePercent = attendance.attendancePercent || 0;
  const requiredPercent = attendance.requiredPercent || 80;

  // ICA guidance
  const needsMoreIcaAttendance = ica.attendedCount < 2;
  const neededMarks = [];
  if (ica.attended.ICA1 && Number(ica.marks.ICA1) < 40) {
    neededMarks.push({ key: "ICA1", name: "Research Proposal", need: 40 - Number(ica.marks.ICA1), current: Number(ica.marks.ICA1) });
  }
  if (ica.attended.ICA2 && Number(ica.marks.ICA2) < 40) {
    neededMarks.push({ key: "ICA2", name: "Mid-term Quiz", need: 40 - Number(ica.marks.ICA2), current: Number(ica.marks.ICA2) });
  }
  if (ica.attended.ICA3 && Number(ica.marks.ICA3) < 40) {
    neededMarks.push({ key: "ICA3", name: "Final Assessment", need: 40 - Number(ica.marks.ICA3), current: Number(ica.marks.ICA3) });
  }

  // Calculate circular progress for attendance
  const attendanceProgress = (attendancePercent / 100) * 360;

  const saveImprovementPlan = () => {
    // Here you could save the simulation data
    Alert.alert("Success", "Improvement plan saved!");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Improvement Planner</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Current Status Banner */}
        <View style={styles.statusBanner}>
          <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
          <Text style={styles.statusBannerText}>CURRENT STATUS {status.toUpperCase()}</Text>
        </View>

        {/* Current Gaps Section */}
        <View style={styles.section}>
          <Text style={styles.sectionMainTitle}>Current Gaps</Text>

          {/* Academic Alert Card */}
          {!attendance.attendancePass && (
            <View style={styles.gapCard}>
              <Text style={styles.gapCardTitle}>ACADEMIC ALERT</Text>
              <View style={styles.gapCardContent}>
                <View style={styles.gapCardLeft}>
                  <Text style={styles.gapCardValue}>Attendance: {attendancePercent.toFixed(0)}%</Text>
                  <Text style={styles.gapCardNeed}>
                    Need {missingPercent.toFixed(1)}% more to reach eligibility.
                  </Text>
                </View>
                <View style={styles.circularProgressContainer}>
                  <View style={[
                    styles.circularProgressOuter,
                    { borderColor: attendancePercent >= requiredPercent ? "#10B981" : "#EF4444" }
                  ]}>
                    <Text style={[
                      styles.circularProgressText,
                      { color: attendancePercent >= requiredPercent ? "#10B981" : "#EF4444" }
                    ]}>
                      {attendancePercent.toFixed(0)}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Performance Gap Card */}
          {neededMarks.length > 0 && (
            <View style={styles.gapCard}>
              <Text style={styles.gapCardTitle}>PERFORMANCE GAP</Text>
              <View style={styles.gapCardContent}>
                <View style={styles.gapCardLeft}>
                  <Text style={styles.gapCardValue}>
                    {neededMarks[0].key}: {neededMarks[0].current} Marks
                  </Text>
                  <Text style={styles.gapCardNeed}>
                    Need +{neededMarks[0].need} marks to pass threshold.
                  </Text>
                </View>
                <View style={styles.gapCardIcons}>
                  <Ionicons name="bar-chart" size={20} color="#EF4444" />
                  <Ionicons name="alert-circle" size={20} color="#EF4444" />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Simulation Section */}
        <View style={styles.section}>
          <View style={styles.simulationHeader}>
            <Text style={styles.sectionMainTitle}>Simulation</Text>
            <View style={styles.liveModeBadge}>
              <Text style={styles.liveModeText}>LIVE MODE</Text>
            </View>
          </View>

          {/* Eligible Status Meta Banner */}
          {simulatedAttendance >= requiredPercent && simulatedIcaMark >= 40 && (
            <View style={styles.eligibleBanner}>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.eligibleBannerText}>Eligible Status Meta</Text>
            </View>
          )}

          {/* Adjust Attendance Slider */}
          <View style={styles.sliderCard}>
            <Text style={styles.sliderLabel}>ADJUST ATTENDANCE</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={simulatedAttendance}
              onValueChange={setSimulatedAttendance}
              minimumTrackTintColor="#2563EB"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#2563EB"
            />
            <View style={styles.sliderValueContainer}>
              <Text style={styles.sliderValue}>{simulatedAttendance.toFixed(0)}%</Text>
            </View>
            <View style={styles.sliderInfo}>
              <Text style={styles.sliderInfoText}>MIN REQUIRED: {requiredPercent}%</Text>
              <Text style={styles.sliderInfoText}>GOAL: 80%+</Text>
            </View>
          </View>

          {/* Adjust ICA Marks Slider */}
          <View style={styles.sliderCard}>
            <Text style={styles.sliderLabel}>ADJUST ICA MARKS</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={simulatedIcaMark}
              onValueChange={setSimulatedIcaMark}
              minimumTrackTintColor="#2563EB"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#2563EB"
            />
            <View style={styles.sliderValueContainer}>
              <Text style={styles.sliderValue}>{simulatedIcaMark.toFixed(0)}/100</Text>
            </View>
            <View style={styles.sliderInfo}>
              <Text style={styles.sliderInfoText}>THRESHOLD: 40</Text>
              <Text style={styles.sliderInfoText}>DISTINCTION: 75</Text>
            </View>
          </View>

          {/* Note */}
          <Text style={styles.noteText}>
            Note: Simulations are for planning purposes and do not reflect official academic records.
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveImprovementPlan}>
          <Text style={styles.saveButtonText}>Save Improvement Plan</Text>
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
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  statusBannerText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionMainTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  simulationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  liveModeBadge: {
    backgroundColor: "#DBEAFE",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  liveModeText: {
    color: "#2563EB",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  eligibleBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  eligibleBannerText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  gapCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  gapCardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 1,
    marginBottom: 12,
  },
  gapCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gapCardLeft: {
    flex: 1,
  },
  gapCardValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  gapCardNeed: {
    fontSize: 13,
    color: "#EF4444",
    fontWeight: "600",
  },
  circularProgressContainer: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  circularProgressOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  circularProgressText: {
    fontSize: 14,
    fontWeight: "700",
  },
  gapCardIcons: {
    flexDirection: "row",
    gap: 8,
  },
  sliderCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderValueContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  sliderValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2563EB",
  },
  sliderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sliderInfoText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },
  noteText: {
    fontSize: 11,
    color: "#9CA3AF",
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "center",
  },
  saveButton: {
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
  saveButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});

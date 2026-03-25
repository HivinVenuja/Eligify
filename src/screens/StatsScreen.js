import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BottomTabs from "../navigation/BottomTabs";
import { loadSubjects } from "../utils/storage";

export default function StatsScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);

  const loadData = useCallback(async () => {
    const savedSubjects = await loadSubjects();
    setSubjects(savedSubjects);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Calculate statistics
  const totalSubjects = subjects.length;
  const eligibleCount = subjects.filter(s => s.status === "Eligible").length;
  const atRiskCount = subjects.filter(s => s.status === "At Risk").length;
  const notEligibleCount = subjects.filter(s => s.status === "Not Eligible").length;
  
  const avgAttendance = subjects.length > 0
    ? subjects.reduce((sum, s) => sum + (s.resultPayload?.attendance?.attendancePercent || 0), 0) / subjects.length
    : 0;

  const totalIcaCount = subjects.reduce((sum, s) => {
    return sum + (s.resultPayload?.ica?.attendedCount || 0);
  }, 0);
  const avgIcaCount = subjects.length > 0 ? totalIcaCount / subjects.length : 0;

  const StatCard = ({ icon, label, value, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="school" size={24} color="#2563EB" />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Eligify</Text>
            <Text style={styles.headerSubtitle}>Academic Eligibility</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Statistics</Text>
          <Text style={styles.mainSubtitle}>Overview of your academic performance</Text>
        </View>

        {totalSubjects === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bar-chart-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Statistics</Text>
            <Text style={styles.emptyText}>Add subjects to see your statistics</Text>
          </View>
        ) : (
          <>
            <View style={styles.statsGrid}>
              <StatCard
                icon="book"
                label="Total Subjects"
                value={totalSubjects}
                color="#2563EB"
              />
              <StatCard
                icon="checkmark-circle"
                label="Eligible"
                value={eligibleCount}
                color="#10B981"
              />
              <StatCard
                icon="alert-circle"
                label="At Risk"
                value={atRiskCount}
                color="#F59E0B"
              />
              <StatCard
                icon="close-circle"
                label="Not Eligible"
                value={notEligibleCount}
                color="#EF4444"
              />
            </View>

            <View style={styles.metricsSection}>
              <Text style={styles.sectionTitle}>Average Metrics</Text>
              <View style={styles.metricCard}>
                <View style={styles.metricRow}>
                  <Ionicons name="calendar" size={20} color="#2563EB" />
                  <Text style={styles.metricLabel}>Average Attendance</Text>
                  <Text style={styles.metricValue}>{avgAttendance.toFixed(1)}%</Text>
                </View>
                <View style={styles.metricRow}>
                  <Ionicons name="briefcase" size={20} color="#2563EB" />
                  <Text style={styles.metricLabel}>Average ICAs Attended</Text>
                  <Text style={styles.metricValue}>{avgIcaCount.toFixed(1)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.distributionSection}>
              <Text style={styles.sectionTitle}>Eligibility Distribution</Text>
              <View style={styles.distributionCard}>
                <View style={styles.distributionBar}>
                  <View style={[styles.distributionSegment, { 
                    width: `${totalSubjects > 0 ? (eligibleCount / totalSubjects) * 100 : 0}%`,
                    backgroundColor: "#10B981"
                  }]} />
                  <View style={[styles.distributionSegment, { 
                    width: `${totalSubjects > 0 ? (atRiskCount / totalSubjects) * 100 : 0}%`,
                    backgroundColor: "#F59E0B"
                  }]} />
                  <View style={[styles.distributionSegment, { 
                    width: `${totalSubjects > 0 ? (notEligibleCount / totalSubjects) * 100 : 0}%`,
                    backgroundColor: "#EF4444"
                  }]} />
                </View>
                <View style={styles.distributionLabels}>
                  <View style={styles.distributionLabel}>
                    <View style={[styles.colorDot, { backgroundColor: "#10B981" }]} />
                    <Text style={styles.distributionText}>Eligible: {eligibleCount}</Text>
                  </View>
                  <View style={styles.distributionLabel}>
                    <View style={[styles.colorDot, { backgroundColor: "#F59E0B" }]} />
                    <Text style={styles.distributionText}>At Risk: {atRiskCount}</Text>
                  </View>
                  <View style={styles.distributionLabel}>
                    <View style={[styles.colorDot, { backgroundColor: "#EF4444" }]} />
                    <Text style={styles.distributionText}>Not Eligible: {notEligibleCount}</Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTextContainer: {
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  content: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 80,
  },
  titleSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
  },
  metricsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  metricCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  metricLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },
  distributionSection: {
    marginBottom: 24,
  },
  distributionCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  distributionBar: {
    flexDirection: "row",
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  distributionSegment: {
    height: "100%",
  },
  distributionLabels: {
    gap: 8,
  },
  distributionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  distributionText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
  },
});

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BottomTabs from "../navigation/BottomTabs";
import { loadSubjects } from "../utils/storage";

export default function AlertsScreen({ navigation }) {
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

  // Generate alerts based on subject status
  const generateAlerts = () => {
    const alerts = [];
    
    subjects.forEach((subject) => {
      const { status, resultPayload } = subject;
      const attendance = resultPayload?.attendance;
      const ica = resultPayload?.ica;

      if (status === "Not Eligible") {
        alerts.push({
          id: `${subject.id}-not-eligible`,
          type: "error",
          title: "Not Eligible",
          message: `${subject.name} does not meet eligibility requirements`,
          subject: subject,
          priority: "high",
        });
      } else if (status === "At Risk") {
        alerts.push({
          id: `${subject.id}-at-risk`,
          type: "warning",
          title: "At Risk",
          message: `${subject.name} is close to eligibility threshold`,
          subject: subject,
          priority: "medium",
        });
      }

      // Attendance alerts
      if (attendance && !attendance.attendancePass) {
        const missing = attendance.requiredPercent - attendance.attendancePercent;
        alerts.push({
          id: `${subject.id}-attendance`,
          type: "warning",
          title: "Low Attendance",
          message: `${subject.name}: Need ${missing.toFixed(1)}% more attendance`,
          subject: subject,
          priority: "medium",
        });
      }

      // ICA alerts
      if (ica && ica.attendedCount < 2) {
        alerts.push({
          id: `${subject.id}-ica-count`,
          type: "warning",
          title: "Incomplete ICAs",
          message: `${subject.name}: Only ${ica.attendedCount}/3 ICAs attended`,
          subject: subject,
          priority: "high",
        });
      }

      // Low ICA marks alerts
      if (ica) {
        const lowMarks = [];
        if (ica.attended?.ICA1 && Number(ica.marks?.ICA1) < 40) {
          lowMarks.push(`ICA1: ${ica.marks.ICA1}/100`);
        }
        if (ica.attended?.ICA2 && Number(ica.marks?.ICA2) < 40) {
          lowMarks.push(`ICA2: ${ica.marks.ICA2}/100`);
        }
        if (ica.attended?.ICA3 && Number(ica.marks?.ICA3) < 40) {
          lowMarks.push(`ICA3: ${ica.marks.ICA3}/100`);
        }
        if (lowMarks.length > 0) {
          alerts.push({
            id: `${subject.id}-ica-marks`,
            type: "error",
            title: "Low ICA Marks",
            message: `${subject.name}: ${lowMarks.join(", ")}`,
            subject: subject,
            priority: "high",
          });
        }
      }
    });

    // Sort by priority (high first)
    return alerts.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const alerts = generateAlerts();

  const getAlertIcon = (type) => {
    switch (type) {
      case "error":
        return "close-circle";
      case "warning":
        return "alert-circle";
      default:
        return "information-circle";
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "error":
        return "#EF4444";
      case "warning":
        return "#F59E0B";
      default:
        return "#2563EB";
    }
  };

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

      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Alerts</Text>
        <Text style={styles.mainSubtitle}>
          {alerts.length > 0 ? `${alerts.length} alert${alerts.length > 1 ? "s" : ""} need attention` : "All clear!"}
        </Text>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const alertColor = getAlertColor(item.type);
          return (
            <TouchableOpacity
              style={[styles.alertCard, { borderLeftColor: alertColor }]}
              onPress={() => navigation.navigate("Result", { resultPayload: item.subject.resultPayload })}
              activeOpacity={0.7}
            >
              <View style={styles.alertHeader}>
                <Ionicons name={getAlertIcon(item.type)} size={24} color={alertColor} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{item.title}</Text>
                  <Text style={styles.alertMessage}>{item.message}</Text>
                </View>
              </View>
              <View style={styles.alertFooter}>
                <Text style={styles.alertSubject}>{item.subject.name}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            <Text style={styles.emptyTitle}>No Alerts</Text>
            <Text style={styles.emptyText}>All your subjects are in good standing!</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

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
  titleSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  alertCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  alertHeader: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  alertFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  alertSubject: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
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
    textAlign: "center",
  },
});

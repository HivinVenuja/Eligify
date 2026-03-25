import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BottomTabs from "../navigation/BottomTabs";
import { loadSubjects } from "../utils/storage";
import StatusBadge from "../components/StatusBadge";

export default function ScheduleScreen({ navigation }) {
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

  const getCheckedDate = (subject) => {
    if (subject.resultPayload?.checkedAt) {
      const date = new Date(subject.resultPayload.checkedAt);
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric",
        year: "numeric"
      });
    }
    return "N/A";
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
        <Text style={styles.mainTitle}>Schedule</Text>
        <Text style={styles.mainSubtitle}>Your subject eligibility check history</Text>
      </View>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.scheduleCard}
            onPress={() => navigation.navigate("Result", { resultPayload: item.resultPayload })}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardLeft}>
                <Ionicons name="calendar" size={20} color="#2563EB" />
                <Text style={styles.subjectName}>{item.name}</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>
            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.detailText}>Checked: {getCheckedDate(item)}</Text>
              </View>
              {item.resultPayload?.attendance && (
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    Attendance: {item.resultPayload.attendance.attendancePercent}%
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Schedule</Text>
            <Text style={styles.emptyText}>Your checked subjects will appear here</Text>
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
  scheduleCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
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
  },
});

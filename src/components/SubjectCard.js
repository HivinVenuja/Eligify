import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "./StatusBadge";

export default function SubjectCard({ subject, onPress, onDelete }) {
  const resultPayload = subject.resultPayload || {};
  const attendance = resultPayload.attendance || {};
  const ica = resultPayload.ica || {};
  
  const attendancePercent = attendance.attendancePercent || 0;
  const icaCount = ica.attendedCount || 0;
  const totalIca = 3;
  
  // Determine colors based on status
  const status = subject.status || "Not Eligible";
  const progressColor = 
    status === "Eligible" ? "#10B981" :
    status === "At Risk" ? "#F59E0B" :
    "#EF4444";
  
  const textColor = 
    status === "Eligible" ? "#10B981" :
    status === "At Risk" ? "#F59E0B" :
    "#EF4444";
  
  // Determine icons and colors
  const attendancePass = attendancePercent >= (attendance.requiredPercent || 80);
  const icaPass = icaCount >= 2;
  
  const attendanceIcon = attendancePass ? "checkmark-circle" : "close-circle";
  const icaIcon = icaPass ? "checkmark-circle" : "alert-circle";
  const attendanceIconColor = attendancePass ? "#10B981" : textColor;
  const icaIconColor = icaPass ? "#10B981" : textColor;

  const handleDelete = () => {
    console.log("Delete button pressed for subject:", subject.id, subject.name);
    if (onDelete) {
      onDelete(subject.id);
    } else {
      console.log("Warning: onDelete prop is not defined");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{subject.name}</Text>
          <View style={styles.headerRight}>
            <StatusBadge status={status} />
            {onDelete && (
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.deleteButton}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View style={styles.deleteButtonInner}>
                  <Ionicons name="trash-outline" size={12} color="#EF4444" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      
        <TouchableOpacity 
          onPress={onPress} 
          activeOpacity={0.7}
          style={styles.touchableContent}
        >
          <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>ATTENDANCE PROGRESS</Text>
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${Math.min(attendancePercent, 100)}%`, backgroundColor: progressColor }]} />
            </View>
            <Text style={[styles.progressPercent, { color: progressColor }]}>{attendancePercent.toFixed(0)}%</Text>
          </View>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={16} color={attendanceIconColor} />
            <Ionicons name={attendanceIcon} size={12} color={attendanceIconColor} style={styles.statusIcon} />
            <Text style={[styles.detailText, { color: attendanceIconColor }]}>
              Attendance: {attendancePercent.toFixed(0)}%
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="briefcase" size={16} color={icaIconColor} />
            <Ionicons name={icaIcon} size={12} color={icaIconColor} style={styles.statusIcon} />
            <Text style={[styles.detailText, { color: icaPass ? "#000000" : textColor }]}>
              ICAs: {icaCount}/{totalIca}
            </Text>
          </View>
        </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  touchableContent: {
    flex: 1,
  },
  title: { 
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonPlaceholder: {
    width: 28,
    height: 28,
  },
  deleteButtonInner: {
    width: 20,
    height: 20,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    top:-7
  },
  progressSection: {
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  progressBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: "700",
    minWidth: 40,
    textAlign: "right",
  },
  detailsRow: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusIcon: {
    marginLeft: -4,
    marginRight: 2,
  },
  detailText: {
    fontSize: 13,
    fontWeight: "500",
  },
});

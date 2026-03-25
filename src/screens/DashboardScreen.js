import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, Modal } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SubjectCard from "../components/SubjectCard";
import BottomTabs from "../navigation/BottomTabs";
import { loadSubjects, deleteSubject } from "../utils/storage";

export default function DashboardScreen({ navigation, route }) {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    visible: false,
    subjectId: null,
    subjectName: null
  });

  console.log("DashboardScreen rendered, subjects count:", subjects.length);

  // Load subjects from AsyncStorage
  const loadData = useCallback(async () => {
    setIsLoading(true);
    const savedSubjects = await loadSubjects();
    setSubjects(savedSubjects);
    setIsLoading(false);
  }, []);

  // Load subjects on mount and when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // When user saves a subject from Result screen, just reload data
  // (subject is already saved in ResultScreen, so we just refresh)
  useEffect(() => {
    if (route.params?.savedSubject) {
      // Subject is already saved in ResultScreen, just reload from storage
      loadData();
      // Clear the route params
      navigation.setParams({ savedSubject: undefined });
    }
  }, [route.params?.savedSubject, navigation, loadData]);

  // Handle delete subject
  const handleDelete = (subjectId) => {
    console.log("handleDelete called with subjectId:", subjectId);
    const subject = subjects.find(s => s.id === subjectId);
    const subjectName = subject?.name || "this subject";
    console.log("Deleting subject:", subjectName);
    
    // Show confirmation modal instead of Alert
    setDeleteConfirmation({
      visible: true,
      subjectId: subjectId,
      subjectName: subjectName
    });
  };

  const confirmDelete = async () => {
    const { subjectId, subjectName } = deleteConfirmation;
    console.log("User confirmed delete for:", subjectName);
    
    try {
      const updatedSubjects = await deleteSubject(subjectId);
      console.log("Updated subjects after delete:", updatedSubjects);
      console.log("New subjects count:", updatedSubjects.length);
      setSubjects(updatedSubjects);
      setDeleteConfirmation({ visible: false, subjectId: null, subjectName: null });
    } catch (error) {
      console.error("Error during deletion:", error);
      setDeleteConfirmation({ visible: false, subjectId: null, subjectName: null });
    }
  };

  const cancelDelete = () => {
    console.log("Delete canceled");
    setDeleteConfirmation({ visible: false, subjectId: null, subjectName: null });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="school" size={24} color="#2563EB" />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Eligify</Text>
            <Text style={styles.headerSubtitle}>Academic Eligibility</Text>
          </View>
        </View>
        <TouchableOpacity>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={20} color="#2563EB" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Final Exam Eligibility</Text>
        <Text style={styles.mainSubtitle}>Real-time tracking of your course standings</Text>
      </View>

      {/* Subjects List */}
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        extraData={subjects}
        renderItem={({ item }) => (
          <SubjectCard
            subject={item}
            onPress={() => {
              // Navigate to EligibilityCheck with existing data for editing
              const subjectData = item.resultPayload?.subject || { 
                code: item.name.split(" - ")[0], 
                name: item.name.split(" - ").slice(1).join(" - ") || item.name
              };
              navigation.navigate("EligibilityCheck", { 
                subject: subjectData,
                existingData: item.resultPayload, // Pass existing data to pre-fill form
                existingSubjectId: item.id // Pass ID for updating
              });
            }}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>No subjects yet. Tap + to add one.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("SubjectDetails")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <BottomTabs navigation={navigation} />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteConfirmation.visible}
        transparent
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Subject</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete {deleteConfirmation.subjectName}? This action cannot be undone.
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDelete}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButtonConfirm]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 50,
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
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  empty: {
    marginTop: 30,
    color: "#6B7280",
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    right: 18,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  deleteButtonConfirm: {
    backgroundColor: "#EF4444",
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

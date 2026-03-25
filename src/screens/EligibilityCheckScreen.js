import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, SafeAreaView, ScrollView, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import InputField from "../components/InputField";
import BottomTabs from "../navigation/BottomTabs";

export default function EligibilityCheckScreen({ navigation, route }) {
  const { subject, existingData, existingSubjectId } = route.params || {};

  // Pre-fill form if existing data is provided (when editing)
  const existingAttendance = existingData?.attendance || {};
  const existingIca = existingData?.ica || {};

  // Attendance inputs - pre-fill if editing
  const [totalLectures, setTotalLectures] = useState(existingAttendance.totalLectures?.toString() || "");
  const [attendedLectures, setAttendedLectures] = useState(existingAttendance.attendedLectures?.toString() || "");
  const [requiredPercent, setRequiredPercent] = useState(existingAttendance.requiredPercent?.toString() || "75");

  // ICA attended toggles - pre-fill if editing
  const [ica1, setIca1] = useState(existingIca.attended?.ICA1 || false);
  const [ica2, setIca2] = useState(existingIca.attended?.ICA2 || false);
  const [ica3, setIca3] = useState(existingIca.attended?.ICA3 || false);

  // ICA marks - pre-fill if editing
  const [ica1Mark, setIca1Mark] = useState(existingIca.marks?.ICA1?.toString() || "");
  const [ica2Mark, setIca2Mark] = useState(existingIca.marks?.ICA2?.toString() || "");
  const [ica3Mark, setIca3Mark] = useState(existingIca.marks?.ICA3?.toString() || "");

  // Validation errors
  const [totalLecturesError, setTotalLecturesError] = useState(false);
  const [attendedLecturesError, setAttendedLecturesError] = useState(false);
  const [ica1MarkError, setIca1MarkError] = useState(false);
  const [ica2MarkError, setIca2MarkError] = useState(false);
  const [ica3MarkError, setIca3MarkError] = useState(false);

  const attendancePercent = useMemo(() => {
    const t = Number(totalLectures);
    const a = Number(attendedLectures);
    if (!t || t <= 0) return 0;
    return (a / t) * 100;
  }, [totalLectures, attendedLectures]);

  // Validate total lectures
  const validateTotalLectures = (value) => {
    if (!value.trim()) {
      setTotalLecturesError(false);
      return false;
    }
    const num = Number(value);
    const isValid = !isNaN(num) && num > 0 && num <= 1000;
    setTotalLecturesError(!isValid);
    return isValid;
  };

  // Validate attended lectures
  const validateAttendedLectures = (value) => {
    if (!value.trim()) {
      setAttendedLecturesError(false);
      return false;
    }
    const num = Number(value);
    const total = Number(totalLectures);
    const isValid = !isNaN(num) && num >= 0 && (!total || num <= total);
    setAttendedLecturesError(!isValid);
    return isValid;
  };

  // Validate ICA marks
  const validateIcaMark = (value, setError) => {
    if (!value.trim()) {
      setError(false);
      return false;
    }
    const num = Number(value);
    const isValid = !isNaN(num) && num >= 0 && num <= 100;
    setError(!isValid);
    return isValid;
  };

  const handleTotalLecturesChange = (text) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setTotalLectures(numericValue);
    validateTotalLectures(numericValue);
    // Re-validate attended lectures if total changes
    if (attendedLectures) {
      validateAttendedLectures(attendedLectures);
    }
  };

  const handleAttendedLecturesChange = (text) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setAttendedLectures(numericValue);
    validateAttendedLectures(numericValue);
  };

  const handleIca1MarkChange = (text) => {
    // Only allow numbers and decimal point
    const numericValue = text.replace(/[^0-9.]/g, '');
    setIca1Mark(numericValue);
    validateIcaMark(numericValue, setIca1MarkError);
  };

  const handleIca2MarkChange = (text) => {
    const numericValue = text.replace(/[^0-9.]/g, '');
    setIca2Mark(numericValue);
    validateIcaMark(numericValue, setIca2MarkError);
  };

  const handleIca3MarkChange = (text) => {
    const numericValue = text.replace(/[^0-9.]/g, '');
    setIca3Mark(numericValue);
    validateIcaMark(numericValue, setIca3MarkError);
  };

  const resetAllFields = () => {
    setTotalLectures("");
    setAttendedLectures("");
    setRequiredPercent("75");
    setIca1(false);
    setIca2(false);
    setIca3(false);
    setIca1Mark("");
    setIca2Mark("");
    setIca3Mark("");
    setTotalLecturesError(false);
    setAttendedLecturesError(false);
    setIca1MarkError(false);
    setIca2MarkError(false);
    setIca3MarkError(false);
  };

  const validateAndGo = () => {
    // Validate all fields first
    const isTotalValid = validateTotalLectures(totalLectures);
    const isAttendedValid = validateAttendedLectures(attendedLectures);
    
    const t = Number(totalLectures);
    const a = Number(attendedLectures);
    const req = Number(requiredPercent);

    // Basic validation
    if (!totalLectures.trim()) {
      return Alert.alert("Missing Field", "Please enter total lectures.");
    }
    if (!isTotalValid) {
      return Alert.alert("Invalid Input", "Total lectures must be a positive number (max 1000).");
    }
    if (!attendedLectures.trim()) {
      return Alert.alert("Missing Field", "Please enter attended lectures.");
    }
    if (!isAttendedValid) {
      return Alert.alert("Invalid Input", `Attended lectures must be between 0 and ${t}.`);
    }
    if (!t || t <= 0) {
      return Alert.alert("Invalid", "Total lectures must be greater than 0.");
    }
    if (a < 0 || a > t) {
      return Alert.alert("Invalid", "Attended lectures must be between 0 and total lectures.");
    }
    if (req < 0 || req > 100) {
      return Alert.alert("Invalid", "Required attendance % must be between 0 and 100.");
    }

    // ICA validation
    const attendedList = [
      { key: "ICA1", attended: ica1, mark: ica1Mark },
      { key: "ICA2", attended: ica2, mark: ica2Mark },
      { key: "ICA3", attended: ica3, mark: ica3Mark },
    ];
    const attendedCount = attendedList.filter((x) => x.attended).length;

    if (attendedCount < 2) {
      return Alert.alert("ICA Rule", "You must attend at least 2 out of 3 ICAs.");
    }

    // Validate ICA marks
    for (const item of attendedList) {
      if (item.attended) {
        if (!item.mark.trim()) {
          return Alert.alert("Missing Marks", `Enter marks for ${item.key}.`);
        }
        const m = Number(item.mark);
        if (isNaN(m) || m < 0 || m > 100) {
          return Alert.alert("Invalid Marks", `${item.key} marks must be between 0 and 100.`);
        }
        // Check for validation errors
        if ((item.key === "ICA1" && ica1MarkError) ||
            (item.key === "ICA2" && ica2MarkError) ||
            (item.key === "ICA3" && ica3MarkError)) {
          return Alert.alert("Invalid Marks", `Please fix the marks for ${item.key}.`);
        }
      }
    }

    // Calculate pass/fail
    const attendancePass = attendancePercent >= req;

    const icaMarksPass = attendedList.every((x) => !x.attended || Number(x.mark) >= 40);
    const icaPass = attendedCount >= 2 && icaMarksPass;

    // Optional "At Risk" classification
    const anyNearIca = attendedList.some((x) => x.attended && Number(x.mark) >= 35 && Number(x.mark) <= 39);
    const nearAttendance = attendancePercent >= req - 5 && attendancePercent < req;

    let status = "Not Eligible";
    if (attendancePass && icaPass) status = "Eligible";
    else if (nearAttendance || anyNearIca) status = "At Risk";

    const resultPayload = {
      subject,
      attendance: {
        totalLectures: t,
        attendedLectures: a,
        attendancePercent: Number(attendancePercent.toFixed(1)),
        requiredPercent: req,
        attendancePass,
      },
      ica: {
        attended: { ICA1: ica1, ICA2: ica2, ICA3: ica3 },
        marks: { ICA1: ica1Mark, ICA2: ica2Mark, ICA3: ica3Mark },
        attendedCount,
        icaPass,
      },
      status,
      checkedAt: new Date().toISOString(),
    };

    navigation.navigate("Result", { 
      resultPayload,
      existingSubjectId // Pass ID so ResultScreen knows if it's an update
    });
  };

  const thresholdOptions = ["70", "75", "80", "85"];
  const attendedCount = [ica1, ica2, ica3].filter(Boolean).length;
  const showIcaWarning = attendedCount < 2;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Eligify</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Heading */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Eligibility Check</Text>
          <Text style={styles.mainSubtitle}>Calculate your academic status for the current semester.</Text>
        </View>

        {/* Attendance Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={20} color="#14B8A6" />
            <Text style={styles.sectionTitle}>Attendance</Text>
          </View>

          <InputField 
            label="Total Lectures" 
            keyboardType="numeric" 
            value={totalLectures} 
            onChangeText={handleTotalLecturesChange} 
            placeholder="e.g., 40"
            error={totalLecturesError}
            errorMessage={totalLecturesError ? "Must be a positive number (max 1000)" : ""}
          />
          <InputField 
            label="Attended" 
            keyboardType="numeric" 
            value={attendedLectures} 
            onChangeText={handleAttendedLecturesChange} 
            placeholder="e.g., 30"
            error={attendedLecturesError}
            errorMessage={attendedLecturesError ? `Must be between 0 and ${totalLectures || 'total'}` : ""}
          />

          {/* Current Ratio Display */}
          <View style={styles.ratioContainer}>
            <Text style={styles.ratioValue}>{attendancePercent.toFixed(0)}%</Text>
            <Text style={styles.ratioLabel}>CURRENT RATIO</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${Math.min(attendancePercent, 100)}%`, 
                  backgroundColor: "#14B8A6" 
                }
              ]} 
            />
          </View>

          {/* Requirement Threshold Buttons */}
          <View style={styles.thresholdSection}>
            <Text style={styles.thresholdLabel}>Requirement Threshold:</Text>
            <View style={styles.thresholdButtons}>
              {thresholdOptions.map((option) => {
                const isSelected = requiredPercent === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.thresholdButton,
                      isSelected && styles.thresholdButtonSelected
                    ]}
                    onPress={() => setRequiredPercent(option)}
                  >
                    <Text style={[
                      styles.thresholdButtonText,
                      isSelected && styles.thresholdButtonTextSelected
                    ]}>
                      {option}%
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ICA Eligibility Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="clipboard" size={20} color="#14B8A6" />
            <Text style={styles.sectionTitle}>ICA Eligibility</Text>
          </View>

          <View>
            <View style={styles.icaRow}>
              <Text style={styles.icaLabel}>ICA 1</Text>
              <Switch 
                value={ica1} 
                onValueChange={setIca1}
                trackColor={{ false: "#D1D5DB", true: "#14B8A6" }}
                thumbColor={ica1 ? "#FFFFFF" : "#F3F4F6"}
              />
              {ica1 && (
                <View style={styles.icaInputContainer}>
                  <TextInput
                    style={[styles.icaInput, ica1MarkError && styles.icaInputError]}
                    keyboardType="numeric"
                    value={ica1Mark}
                    onChangeText={handleIca1MarkChange}
                    placeholder="Marks"
                  />
                  {ica1MarkError && (
                    <Ionicons name="alert-circle" size={16} color="#EF4444" style={styles.icaErrorIcon} />
                  )}
                </View>
              )}
            </View>
            {ica1 && ica1MarkError && (
              <Text style={styles.icaErrorText}>Marks must be between 0 and 100</Text>
            )}
          </View>

          <View>
            <View style={styles.icaRow}>
              <Text style={styles.icaLabel}>ICA 2</Text>
              <Switch 
                value={ica2} 
                onValueChange={setIca2}
                trackColor={{ false: "#D1D5DB", true: "#14B8A6" }}
                thumbColor={ica2 ? "#FFFFFF" : "#F3F4F6"}
              />
              {ica2 && (
                <View style={styles.icaInputContainer}>
                  <TextInput
                    style={[styles.icaInput, ica2MarkError && styles.icaInputError]}
                    keyboardType="numeric"
                    value={ica2Mark}
                    onChangeText={handleIca2MarkChange}
                    placeholder="Marks"
                  />
                  {ica2MarkError && (
                    <Ionicons name="alert-circle" size={16} color="#EF4444" style={styles.icaErrorIcon} />
                  )}
                </View>
              )}
            </View>
            {ica2 && ica2MarkError && (
              <Text style={styles.icaErrorText}>Marks must be between 0 and 100</Text>
            )}
          </View>

          <View>
            <View style={styles.icaRow}>
              <Text style={styles.icaLabel}>ICA 3</Text>
              <Switch 
                value={ica3} 
                onValueChange={setIca3}
                trackColor={{ false: "#D1D5DB", true: "#14B8A6" }}
                thumbColor={ica3 ? "#FFFFFF" : "#F3F4F6"}
              />
              {ica3 && (
                <View style={styles.icaInputContainer}>
                  <TextInput
                    style={[styles.icaInput, ica3MarkError && styles.icaInputError]}
                    keyboardType="numeric"
                    value={ica3Mark}
                    onChangeText={handleIca3MarkChange}
                    placeholder="Marks"
                  />
                  {ica3MarkError && (
                    <Ionicons name="alert-circle" size={16} color="#EF4444" style={styles.icaErrorIcon} />
                  )}
                </View>
              )}
            </View>
            {ica3 && ica3MarkError && (
              <Text style={styles.icaErrorText}>Marks must be between 0 and 100</Text>
            )}
          </View>

          {showIcaWarning && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                Attend at least 2 ICAs to remain eligible.
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.primaryBtn} onPress={validateAndGo}>
          <Text style={styles.primaryBtnText}>Check Eligibility</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={resetAllFields} style={styles.resetButton}>
          <Text style={styles.resetText}>Reset all fields</Text>
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
  titleSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  card: { 
    backgroundColor: "#F9FAFB", 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#111827",
  },
  ratioContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  ratioValue: {
    fontSize: 48,
    fontWeight: "800",
    color: "#14B8A6",
    marginBottom: 4,
  },
  ratioLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  thresholdSection: {
    marginTop: 8,
  },
  thresholdLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  thresholdButtons: {
    flexDirection: "row",
    gap: 8,
  },
  thresholdButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  thresholdButtonSelected: {
    backgroundColor: "#14B8A6",
    borderColor: "#14B8A6",
  },
  thresholdButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  thresholdButtonTextSelected: {
    color: "#FFFFFF",
  },
  icaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  icaLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    minWidth: 60,
  },
  icaInputContainer: {
    flex: 1,
  },
  icaInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    paddingRight: 36,
  },
  icaInputError: {
    borderColor: "#EF4444",
  },
  icaErrorIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  icaErrorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 72,
    marginBottom: 8,
    fontWeight: "500",
  },
  warningContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#EF4444",
  },
  warningText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#DC2626",
  },
  primaryBtn: { 
    backgroundColor: "#14B8A6", 
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
  resetButton: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 8,
  },
  resetText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
});

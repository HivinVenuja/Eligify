import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import InputField from "../components/InputField";
import BottomTabs from "../navigation/BottomTabs";

export default function SubjectDetailsScreen({ navigation }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [lecturerError, setLecturerError] = useState(false);
  const [touched, setTouched] = useState({ code: false, name: false, lecturer: false });

  // Validate subject code format (e.g., CS 10, TICT4242, etc.)
  const validateCode = (codeValue) => {
    if (!codeValue.trim()) {
      setCodeError(false);
      return false;
    }
    // Allow formats like: CS 10, TICT4242, CS101, etc.
    const codePattern = /^[A-Z]{2,6}\s?[0-9]{1,6}$/i;
    const isValid = codePattern.test(codeValue.trim());
    setCodeError(!isValid);
    return isValid;
  };

  // Validate subject name
  const validateName = (nameValue) => {
    if (!nameValue.trim()) {
      setNameError(false);
      return false;
    }
    // Name should be at least 3 characters
    const isValid = nameValue.trim().length >= 3;
    setNameError(!isValid);
    return isValid;
  };

  // Validate lecturer name (optional but if provided, should be valid)
  const validateLecturer = (lecturerValue) => {
    if (!lecturerValue.trim()) {
      setLecturerError(false);
      return true; // Optional field
    }
    // Lecturer name should be at least 2 characters if provided
    const isValid = lecturerValue.trim().length >= 2;
    setLecturerError(!isValid);
    return isValid;
  };

  const handleCodeChange = (text) => {
    setCode(text);
    setTouched(prev => ({ ...prev, code: true }));
    if (text.trim()) {
      validateCode(text);
    } else {
      setCodeError(false);
    }
  };

  const handleNameChange = (text) => {
    setName(text);
    setTouched(prev => ({ ...prev, name: true }));
    if (text.trim()) {
      validateName(text);
    } else {
      setNameError(false);
    }
  };

  const handleLecturerChange = (text) => {
    setLecturer(text);
    setTouched(prev => ({ ...prev, lecturer: true }));
    validateLecturer(text);
  };

  const onNext = () => {
    // Mark all fields as touched
    setTouched({ code: true, name: true, lecturer: true });

    // Validate all fields
    const isCodeValid = validateCode(code);
    const isNameValid = validateName(name);
    const isLecturerValid = validateLecturer(lecturer);

    if (!code.trim()) {
      Alert.alert("Missing Field", "Please enter subject code.");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Missing Field", "Please enter subject name.");
      return;
    }

    if (!isCodeValid) {
      Alert.alert("Invalid Code", "Please enter a valid subject code format (e.g., CS 10, TICT4242).");
      return;
    }

    if (!isNameValid) {
      Alert.alert("Invalid Name", "Subject name must be at least 3 characters long.");
      return;
    }

    if (!isLecturerValid) {
      Alert.alert("Invalid Lecturer", "Lecturer name must be at least 2 characters long if provided.");
      return;
    }

    navigation.navigate("EligibilityCheck", {
      subject: { 
        code: code.trim(), 
        name: name.trim(),
        lecturer: lecturer.trim() || undefined,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        {/* <Text style={styles.headerTitle}>Add Subject</Text> */}
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Heading */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Subject Details</Text>
          <Text style={styles.subtitle}>Enter the official credentials for your new module.</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <InputField 
            label="SUBJECT CODE" 
            placeholder="e.g., CS 10" 
            value={code} 
            onChangeText={handleCodeChange}
            error={touched.code && codeError}
            errorMessage={touched.code && codeError ? "Invalid code format" : ""}
          />
          <InputField 
            label="SUBJECT NAME" 
            placeholder="e.g., Data Structures" 
            value={name} 
            onChangeText={handleNameChange}
            error={touched.name && nameError}
            errorMessage={touched.name && nameError ? "Name must be at least 3 characters" : ""}
          />
          <InputField 
            label="LECTURER NAME" 
            placeholder="e.g., Prof. Smith" 
            value={lecturer} 
            onChangeText={handleLecturerChange}
            error={touched.lecturer && lecturerError}
            errorMessage={touched.lecturer && lecturerError ? "Name must be at least 2 characters" : ""}
          />
        </View>

        

        {/* Next Button */}
        <TouchableOpacity style={styles.primaryBtn} onPress={onNext}>
          <Text style={styles.primaryBtnText}>Next →</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    top:30
  },
  placeholder: {
    width: 32,
  },
  content: {
    padding: 16,
    paddingTop: 20,
    flexGrow: 1,
  },
  titleSection: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
    justifyContent: "center",
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  progressDotActive: {
    backgroundColor: "#DBEAFE",
    borderColor: "#2563EB",
  },
  primaryBtn: { 
    backgroundColor: "#2563EB", 
    padding: 16, 
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  primaryBtnText: { 
    color: "#FFFFFF", 
    textAlign: "center", 
    fontWeight: "700",
    fontSize: 16,
  },
  stepIndicator: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
  },
});

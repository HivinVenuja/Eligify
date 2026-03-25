import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function InputField({ label, value, onChangeText, placeholder, keyboardType = "default", error, errorMessage }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
        />
        {error && (
          <Ionicons name="alert-circle" size={20} color="#EF4444" style={styles.errorIcon} />
        )}
      </View>
      {error && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { 
    fontSize: 12, 
    fontWeight: "700", 
    marginBottom: 8, 
    color: "#111827",
    letterSpacing: 0.5,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    paddingRight: 40,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    fontWeight: "500",
  },
});

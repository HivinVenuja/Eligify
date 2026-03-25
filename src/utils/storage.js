import AsyncStorage from "@react-native-async-storage/async-storage";

const SUBJECTS_KEY = "@eligify_subjects";

// Save subjects to AsyncStorage
export const saveSubjects = async (subjects) => {
  try {
    const jsonValue = JSON.stringify(subjects);
    await AsyncStorage.setItem(SUBJECTS_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error("Error saving subjects:", error);
    return false;
  }
};

// Load subjects from AsyncStorage
export const loadSubjects = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(SUBJECTS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error loading subjects:", error);
    return [];
  }
};

// Add a single subject
export const addSubject = async (newSubject) => {
  try {
    const existingSubjects = await loadSubjects();
    
    // Check if subject with same ID already exists (prevent duplicates)
    const existingIndex = existingSubjects.findIndex(subject => subject.id === newSubject.id);
    
    if (existingIndex !== -1) {
      // Subject already exists, update it instead of adding duplicate
      existingSubjects[existingIndex] = newSubject;
      await saveSubjects(existingSubjects);
      return existingSubjects;
    }
    
    // Add new subject at the beginning
    const updatedSubjects = [newSubject, ...existingSubjects];
    await saveSubjects(updatedSubjects);
    return updatedSubjects;
  } catch (error) {
    console.error("Error adding subject:", error);
    return [];
  }
};

// Update an existing subject by ID
export const updateSubject = async (subjectId, updatedSubject) => {
  try {
    const existingSubjects = await loadSubjects();
    const existingIndex = existingSubjects.findIndex(subject => subject.id === subjectId);
    
    if (existingIndex !== -1) {
      existingSubjects[existingIndex] = updatedSubject;
      await saveSubjects(existingSubjects);
      return existingSubjects;
    }
    
    // If not found, add as new
    return await addSubject(updatedSubject);
  } catch (error) {
    console.error("Error updating subject:", error);
    return [];
  }
};

// Delete a subject by ID
export const deleteSubject = async (subjectId) => {
  try {
    const existingSubjects = await loadSubjects();
    const updatedSubjects = existingSubjects.filter(
      (subject) => subject.id !== subjectId
    );
    await saveSubjects(updatedSubjects);
    return updatedSubjects;
  } catch (error) {
    console.error("Error deleting subject:", error);
    return [];
  }
};

// Clear all subjects
export const clearSubjects = async () => {
  try {
    await AsyncStorage.removeItem(SUBJECTS_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing subjects:", error);
    return false;
  }
};

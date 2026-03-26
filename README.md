
# Eligify – University Exam Eligibility Checker 🎓

**Eligify** is a mobile application designed to empower university students by providing an early and accurate way to check their eligibility for final examinations. Instead of waiting for official notices, students can use this tool to proactively assess their status and understand necessary corrective actions.

## 🚀 Project Objective
The main objective of Eligify is to provide students with a reliable method to determine if they meet the mandatory university requirements for exams. It demonstrates strong problem analysis, clear logic, and an effective UI-driven design.

## ⚖️ Eligibility Rules Implemented
The application strictly follows two core university eligibility rules

1. **Attendance Rule:** * Students must maintain an attendance percentage equal to or above the required limit
   The default requirement is 80%, but it is customizable (e.g., 70%, 75%, 85%) based on faculty rules

2.**ICA (In-Course Assessment) Rule:** * A student must attend at least 2 out of the 3 ICAs
 For every attended ICA, the student must score 40 marks or above

## 📱 Screen-by-Screen Functionality
The app features a logical data flow across several key screens

**Dashboard:** A central overview displaying added subjects and their eligibility status (Eligible, At Risk, or Not Eligible).
*]**Subject Details:** Collects basic information like Subject Code and Subject Name.
***Eligibility Check (Core):** The primary engine where users enter lecture attendance and ICA marks to calculate status.
***Eligibility Result:** Provides a final decision showing pass/fail results for both attendance and ICA rules.
* **Improvement Planner:** Offers actionable feedback for students who are not yet eligible, such as missing attendance or required marks to pass failed ICAs[cite: .

## 🛠️ Internal Logic Summary
1.Calculate attendance percentage and compare against the requirement.
2. Count attended ICAs and validate that marks are ≥ 40 for each.
3. Determine status:
   * **Eligible:** Both attendance and ICA rules pass.
   * **At Risk:** One rule is close to passing.
   * **Not Eligible:** Rules are failed.


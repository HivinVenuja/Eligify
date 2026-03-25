
# Eligify – University Exam Eligibility Checker 🎓

[cite_start]**Eligify** is a mobile application designed to empower university students by providing an early and accurate way to check their eligibility for final examinations[cite: 2, 6]. [cite_start]Instead of waiting for official notices, students can use this tool to proactively assess their status and understand necessary corrective actions[cite: 7].

## 🚀 Project Objective
[cite_start]The main objective of Eligify is to provide students with a reliable method to determine if they meet the mandatory university requirements for exams[cite: 6]. [cite_start]It demonstrates strong problem analysis, clear logic, and an effective UI-driven design[cite: 30].

## ⚖️ Eligibility Rules Implemented
[cite_start]The application strictly follows two core university eligibility rules[cite: 3, 9]:

1. [cite_start]**Attendance Rule:** * Students must maintain an attendance percentage equal to or above the required limit[cite: 9].
   * [cite_start]The default requirement is 80%, but it is customizable (e.g., 70%, 75%, 85%) based on faculty rules[cite: 9].

2. [cite_start]**ICA (In-Course Assessment) Rule:** * A student must attend at least 2 out of the 3 ICAs[cite: 10].
   * [cite_start]For every attended ICA, the student must score 40 marks or above[cite: 10].

## 📱 Screen-by-Screen Functionality
[cite_start]The app features a logical data flow across several key screens[cite: 4, 23]:

* [cite_start]**Dashboard:** A central overview displaying added subjects and their eligibility status (Eligible, At Risk, or Not Eligible)[cite: 12, 13].
* [cite_start]**Subject Details:** Collects basic information like Subject Code and Subject Name[cite: 14, 15].
* [cite_start]**Eligibility Check (Core):** The primary engine where users enter lecture attendance and ICA marks to calculate status[cite: 16, 17].
* [cite_start]**Eligibility Result:** Provides a final decision showing pass/fail results for both attendance and ICA rules[cite: 18, 19].
* [cite_start]**Improvement Planner:** Offers actionable feedback for students who are not yet eligible, such as missing attendance or required marks to pass failed ICAs[cite: 20, 21].

## 🛠️ Internal Logic Summary
1. [cite_start]Calculate attendance percentage and compare against the requirement[cite: 25].
2. [cite_start]Count attended ICAs and validate that marks are ≥ 40 for each[cite: 25].
3. Determine status:
   * [cite_start]**Eligible:** Both attendance and ICA rules pass[cite: 26].
   * [cite_start]**At Risk:** One rule is close to passing[cite: 26].
   * [cite_start]**Not Eligible:** Rules are failed[cite: 27].


import React from "react";
import {
  Document,
  Page,
  Text,
  Font,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 600, // Changed to semi-bold
    textTransform: "uppercase",
  },
  personalInfo: {
    textAlign: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 11,
    flexDirection: "row",
    justifyContent: "center",
  },
  contactItem: {
    marginHorizontal: 5,
  },
  separator: {
    marginHorizontal: 5,
  },
  workExperience: {
    marginBottom: 10,
  },
  companyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  company: {
    fontSize: 13,
    fontWeight: 600,
  },
  location: {
    fontSize: 11,
    textAlign: "right",
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 400,
    fontFamily: "Helvetica",
    fontStyle: "italic",
  },
  date: {
    fontSize: 11,
    textAlign: "right",
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    fontSize: 11,
  },
  bulletContent: {
    flex: 1,
    fontSize: 11,
  },
  education: {
    marginBottom: 10,
  },
  universityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  university: {
    fontSize: 13,
    fontWeight: 600,
  },
  graduationDate: {
    fontSize: 11,
    textAlign: "right",
  },
  degree: {
    fontSize: 11,
  },
  gpa: {
    fontSize: 11,
    marginTop: 2,
  },
  skills: {
    fontSize: 11,
  },
  project: {
    marginBottom: 8,
  },
  projectName: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: 11,
    marginBottom: 2,
  },
  projectTechnologies: {
    fontSize: 10,
    fontStyle: "italic",
  },
  sectionSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Light grey color
    marginVertical: 10,
  },
  link: {
    color: "#1a0dab",
    textDecoration: "underline",
  },
});

// Create Document Component
const ResumePDF = ({
  personalInfo,
  workExperiences,
  education,
  skills,
  projects,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.personalInfo}>
        <Text style={styles.name}>{personalInfo.name}</Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactItem}>{personalInfo.location}</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.contactItem}>{personalInfo.email}</Text>
          <Text style={styles.separator}>|</Text>
          <Link src={personalInfo.portfolio} style={styles.link}>
            Portfolio
          </Link>
        </View>
      </View>
      <View style={styles.sectionSeparator} />

      <View style={styles.section}>
        <Text style={styles.heading}>Work Experience</Text>
        {workExperiences.map((exp, index) => (
          <View key={index} style={styles.workExperience}>
            <View style={styles.companyHeader}>
              <Text style={styles.company}>{exp.company}</Text>
              <Text style={styles.location}>{exp.location}</Text>
            </View>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{exp.title}</Text>
              <Text style={styles.date}>{exp.date}</Text>
            </View>
            {exp.description.map((item, i) => (
              <View key={i} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletContent}>{item}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.sectionSeparator} />

      <View style={styles.section}>
        <Text style={styles.heading}>Projects</Text>
        {projects.map((project, index) => (
          <View key={index} style={styles.project}>
            <Text style={styles.projectName}>{project.name}</Text>
            <Text style={styles.projectDescription}>{project.description}</Text>
            <Text style={styles.projectTechnologies}>
              {project.technologies}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionSeparator} />

      <View style={styles.section}>
        <Text style={styles.heading}>Education</Text>
        <View style={styles.education}>
          <View style={styles.universityHeader}>
            <Text style={styles.university}>{education.university}</Text>
            <Text style={styles.graduationDate}>
              {education.graduationDate}
            </Text>
          </View>
          <Text style={styles.degree}>{education.degree}</Text>
          <Text style={styles.gpa}>GPA: {education.gpa}</Text>
        </View>
      </View>

      <View style={styles.sectionSeparator} />

      <View style={styles.section}>
        <Text style={styles.heading}>Skills</Text>
        <Text style={styles.skills}>{skills}</Text>
      </View>
    </Page>
  </Document>
);

export default ResumePDF;

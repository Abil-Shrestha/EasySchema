import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Font,
} from "@react-pdf/renderer";
import {
  PersonalInfo,
  WorkExperience,
  Education,
  Project,
} from "../store/resumeStore";

interface ResumePDFProps {
  personalInfo: PersonalInfo;
  workExperiences: WorkExperience[];
  education: Education;
  skills: string[];
  projects: Project[];
}

// Register the fonts
Font.register({
  family: "DMSans",
  fonts: [
    {src: "/fonts/DMSans-Medium.ttf", fontWeight: "normal"},
    {src: "/fonts/DMSans-MediumItalic.ttf", fontStyle: "italic"},
    {src: "/fonts/DMSans-SemiBold.ttf", fontWeight: "bold"},
    {
      src: "/fonts/DMSans-SemiBoldItalic.ttf",
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 16,
    fontFamily: "DMSans",
  },
  section: {
    marginBottom: 3,
  },
  heading: {
    fontSize: 12, // Reduced from 16 to 12 for section headings
    marginBottom: 2,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  personalInfo: {
    textAlign: "center",
    marginBottom: 1,
  },
  name: {
    fontSize: 24, // Kept at 24 as per your approval
    fontWeight: "bold",
    marginBottom: 2,
  },
  contactInfo: {
    fontSize: 9, // Reduced to 9 for contact information
    flexDirection: "row",
    justifyContent: "center",
  },
  contactItem: {
    marginHorizontal: 2,
  },
  separator: {
    marginHorizontal: 2,
  },
  workExperience: {
    marginBottom: 4,
  },
  companyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  company: {
    fontSize: 11, // Reduced from 16 to 11 for company names
    fontWeight: "bold",
  },
  location: {
    fontSize: 9, // Kept at 9 for location
    textAlign: "right",
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  jobTitle: {
    fontSize: 10, // Increased slightly to 10 for job titles
    fontStyle: "italic",
  },
  date: {
    fontSize: 9, // Kept at 9 for dates
    textAlign: "right",
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 0.5,
  },
  bullet: {
    width: 6,
    fontSize: 9, // Kept at 9 for bullet points
  },
  bulletContent: {
    flex: 1,
    fontSize: 9, // Kept at 9 for bullet content
  },
  education: {
    marginBottom: 4,
  },
  universityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  university: {
    fontSize: 11, // Reduced from 16 to 11 for university names
    fontWeight: "bold",
  },
  graduationDate: {
    fontSize: 9, // Kept at 9 for graduation dates
    textAlign: "right",
  },
  degree: {
    fontSize: 10, // Increased slightly to 10 for degree information
  },
  gpa: {
    fontSize: 9, // Kept at 9 for GPA
    marginTop: 0.5,
  },
  skills: {
    fontSize: 9, // Kept at 9 for skills
  },
  project: {
    marginBottom: 3,
  },
  projectName: {
    fontSize: 11, // Reduced from 16 to 11 for project names
    fontWeight: "bold",
    marginBottom: 0.5,
  },
  projectDescription: {
    fontSize: 9, // Kept at 9 for project descriptions
    marginBottom: 0.5,
  },
  projectTechnologies: {
    fontSize: 9, // Kept at 9 for project technologies
    fontStyle: "italic",
  },
  sectionSeparator: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
    marginVertical: 2,
  },
  link: {
    color: "#1a0dab",
    textDecoration: "underline",
  },
});

// Create Document Component
const ResumePDF: React.FC<ResumePDFProps> = ({
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

      <View style={styles.section}>
        <Text style={styles.heading}>Education</Text>
        <View style={styles.sectionSeparator} />
        <View style={styles.education}>
          <View style={styles.universityHeader}>
            <Text style={styles.university}>{education.university}</Text>
            <Text style={styles.graduationDate}>
              {education.graduationDate}
            </Text>
          </View>
          <Text style={styles.degree}>{education.degree}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Work Experience</Text>
        <View style={styles.sectionSeparator} />
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

      <View style={styles.section}>
        <Text style={styles.heading}>Projects</Text>
        <View style={styles.sectionSeparator} />
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

      <View style={styles.section}>
        <Text style={styles.heading}>Skills</Text>
        <View style={styles.sectionSeparator} />
        <Text style={styles.skills}>{skills}</Text>
      </View>
    </Page>
  </Document>
);

export default ResumePDF;

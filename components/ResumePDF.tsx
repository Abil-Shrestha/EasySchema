import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type React from "react";
import type {
  Education,
  PersonalInfo,
  Project,
  WorkExperience,
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
    marginBottom: 4,
  },
  heading: {
    fontSize: 14,
    marginBottom: 3,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  personalInfo: {
    textAlign: "center",
    marginBottom: 2,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 3,
  },
  contactInfo: {
    fontSize: 10,
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
    marginBottom: 5,
  },
  companyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  company: {
    fontSize: 13,
    fontWeight: "bold",
  },
  location: {
    fontSize: 10,
    textAlign: "right",
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 11,
    fontStyle: "italic",
  },
  date: {
    fontSize: 10,
    textAlign: "right",
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 1,
  },
  bullet: {
    width: 6,
    fontSize: 10,
  },
  bulletContent: {
    flex: 1,
    fontSize: 10,
  },
  education: {
    marginBottom: 5,
  },
  universityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  university: {
    fontSize: 13,
    fontWeight: "bold",
  },
  graduationDate: {
    fontSize: 10,
    textAlign: "right",
  },
  degree: {
    fontSize: 11,
  },
  gpa: {
    fontSize: 10,
    marginTop: 1,
  },
  skills: {
    fontSize: 10,
  },
  project: {
    marginBottom: 4,
  },
  projectName: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 1,
  },
  projectDescription: {
    fontSize: 10,
    marginBottom: 1,
  },
  projectTechnologies: {
    fontSize: 10,
    fontStyle: "italic",
  },
  sectionSeparator: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
    marginVertical: 3,
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
            {project.description.map((item, i) => (
              <View key={i} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletContent}>{item}</Text>
              </View>
            ))}
            <Text style={styles.projectTechnologies}>
              Technologies: {project.technologies}
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

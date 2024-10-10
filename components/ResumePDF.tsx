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
    padding: 30,
    fontFamily: "DMSans",
  },
  section: {
    marginBottom: 6,
  },
  heading: {
    fontSize: 12,
    marginBottom: 2,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  personalInfo: {
    textAlign: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 2,
  },
  contactInfo: {
    fontSize: 9,
    flexDirection: "row",
    justifyContent: "center",
  },
  contactItem: {
    marginHorizontal: 3,
  },
  separator: {
    marginHorizontal: 3,
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
    fontSize: 11,
    fontWeight: "bold",
  },
  location: {
    fontSize: 9,
    textAlign: "right",
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  jobTitle: {
    fontSize: 10,
    fontStyle: "italic",
  },
  date: {
    fontSize: 9,
    textAlign: "right",
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 1,
  },
  bullet: {
    width: 8,
    fontSize: 9,
  },
  bulletContent: {
    flex: 1,
    fontSize: 9,
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
    fontSize: 11,
    fontWeight: "bold",
  },
  graduationDate: {
    fontSize: 9,
    textAlign: "right",
  },
  degree: {
    fontSize: 10,
  },
  gpa: {
    fontSize: 9,
    marginTop: 1,
  },
  skills: {
    fontSize: 9,
  },
  project: {
    marginBottom: 3,
  },
  projectHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  projectName: {
    fontSize: 11,
    fontWeight: "bold",
  },
  projectTechnologies: {
    fontSize: 9,
    fontStyle: "italic",
  },
  projectSeparator: {
    marginHorizontal: 4,
    fontSize: 9,
    fontWeight: "normal",
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
          {education.gpa && (
            <Text style={styles.gpa}>GPA: {education.gpa}</Text>
          )}
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
            {exp.description.slice(0, 3).map((item, i) => (
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
        {projects.slice(0, 2).map((project, index) => (
          <View key={index} style={styles.project}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectName}>{project.name}</Text>
              <Text style={styles.projectSeparator}>|</Text>
              <Text style={styles.projectTechnologies}>
                {project.technologies}
              </Text>
            </View>
            {project.description.slice(0, 2).map((item, i) => (
              <View key={i} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletContent}>{item}</Text>
              </View>
            ))}
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

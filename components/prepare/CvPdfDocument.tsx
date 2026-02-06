"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Font,
} from "@react-pdf/renderer";
import type { FixedCvRaw } from "@/lib/data/fixedcv";

// Use WantedSans from public/assets/fonts (served at /assets/fonts/ when running in browser)
const FONT_FAMILY = "WantedSans";
Font.register({
  family: FONT_FAMILY,
  fonts: [
    { src: "/assets/fonts/WantedSans-Regular.ttf", fontWeight: 400 },
    { src: "/assets/fonts/WantedSans-Medium.ttf", fontWeight: 500 },
    { src: "/assets/fonts/WantedSans-SemiBold.ttf", fontWeight: 600 },
    { src: "/assets/fonts/WantedSans-Bold.ttf", fontWeight: 700 },
    { src: "/assets/fonts/WantedSans-ExtraBold.ttf", fontWeight: 800 },
    { src: "/assets/fonts/WantedSans-Black.ttf", fontWeight: 900 },
    { src: "/assets/fonts/WantedSans-ExtraBlack.ttf", fontWeight: 950 },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 40,
    fontFamily: FONT_FAMILY,
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  nameEn: {
    fontSize: 9,
    color: "#555",
    marginBottom: 4,
  },
  title: {
    fontSize: 10,
    fontWeight: 600,
    color: "#222",
    marginBottom: 6,
  },
  summary: {
    fontSize: 8,
    lineHeight: 1.45,
    color: "#333",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 6,
    fontSize: 7,
    color: "#555",
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: "#111",
    letterSpacing: 1.2,
    marginBottom: 6,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 3,
  },
  block: {
    marginBottom: 10,
  },
  blockHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  role: {
    fontSize: 9,
    fontWeight: 600,
    color: "#1a1a1a",
  },
  meta: {
    fontSize: 7,
    color: "#555",
  },
  bullets: {
    marginTop: 3,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 8,
    lineHeight: 1.4,
    color: "#333",
    marginBottom: 2,
  },
  educationLine: {
    fontSize: 9,
    lineHeight: 1.45,
    color: "#333",
  },
  // Two-column layout: main (left) + sidebar (right)
  mainRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 0,
  },
  mainCol: {
    flex: 1,
    paddingRight: 20,
    minWidth: 0,
  },
  sidebar: {
    width: "34%",
    backgroundColor: "#f8f9fa",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderLeftWidth: 1,
    borderLeftColor: "#e5e5e5",
  },
  sidebarSection: {
    marginBottom: 16,
  },
  sidebarSectionLast: {
    marginBottom: 0,
  },
  sidebarTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: "#111",
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 3,
  },
  sidebarSkill: {
    fontSize: 8,
    color: "#333",
    marginBottom: 4,
    lineHeight: 1.35,
  },
  sidebarLang: {
    fontSize: 8,
    color: "#333",
    marginBottom: 4,
    lineHeight: 1.4,
  },
});

function formatPeriod(p?: { start: string; end: string }) {
  if (!p) return "";
  return `${p.start} – ${p.end}`;
}

export function CvPdfDocument({ data }: { data: FixedCvRaw }) {
  const profile = data.profile ?? {};
  const contact = profile.contact ?? {};
  const experience = data.experience ?? [];
  const projects = data.projects_and_activities ?? [];
  const education = data.education;
  const languages = data.languages ?? [];
  const skills = data.skills ?? {};
  const skillList = Object.values(skills).flat();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header: name, title, summary, contact */}
        <View style={styles.header}>
          <Text style={styles.name}>{profile.name_kr ?? ""}</Text>
          {profile.name_en && (
            <Text style={styles.nameEn}>{profile.name_en}</Text>
          )}
          {profile.title && (
            <Text style={styles.title}>{profile.title}</Text>
          )}
          {profile.summary && (
            <Text style={styles.summary}>{profile.summary}</Text>
          )}
          <View style={styles.contactRow}>
            {contact.phone && <Text>{contact.phone}</Text>}
            {contact.email && <Text>{contact.email}</Text>}
            {contact.website && (
              <Link src={contact.website}>{contact.website}</Link>
            )}
            {contact.github && (
              <Link src={contact.github}>{contact.github}</Link>
            )}
          </View>
        </View>

        {/* Two columns: main (Experience, Projects, Education) | sidebar (Skills, Languages) */}
        <View style={styles.mainRow}>
          <View style={styles.mainCol}>
            {/* Experience */}
            {experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {experience.map((exp, i) => (
                  <View key={i} style={styles.block}>
                    <View style={styles.blockHead}>
                      <Text style={styles.role}>{exp.role}</Text>
                      <Text style={styles.meta}>
                        {formatPeriod(exp.period)}
                        {exp.location ? ` · ${exp.location}` : ""}
                      </Text>
                    </View>
                    <Text style={styles.meta}>
                      {exp.company}
                      {exp.location ? ` (${exp.location})` : ""}
                    </Text>
                    <View style={styles.bullets}>
                      {(exp.highlights ?? []).map((h, j) => (
                        <Text key={j} style={styles.bullet}>
                          • {h}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects & Activities</Text>
                {projects.map((pr, i) => (
                  <View key={i} style={styles.block}>
                    <View style={styles.blockHead}>
                      <Text style={styles.role}>{pr.role} · {pr.project}</Text>
                      <Text style={styles.meta}>
                        {formatPeriod(pr.period)}
                        {pr.location ? ` · ${pr.location}` : ""}
                      </Text>
                    </View>
                    <View style={styles.bullets}>
                      {(pr.details ?? []).map((d, j) => (
                        <Text key={j} style={styles.bullet}>
                          • {d}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {education && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                <Text style={styles.educationLine}>
                  {[education.university, education.major, education.double_major]
                    .filter(Boolean)
                    .join(" · ")}
                  {education.period
                    ? `  |  ${formatPeriod(education.period)}`
                    : ""}
                </Text>
              </View>
            )}
          </View>

          {/* Right sidebar: Skills + Languages */}
          {(skillList.length > 0 || languages.length > 0) && (
            <View style={styles.sidebar}>
              {skillList.length > 0 && (
                <View style={styles.sidebarSection}>
                  <Text style={styles.sidebarTitle}>Skills</Text>
                  {skillList.map((s, i) => (
                    <Text key={i} style={styles.sidebarSkill}>
                      {s}
                    </Text>
                  ))}
                </View>
              )}
              {languages.length > 0 && (
                <View
                  style={
                    skillList.length > 0
                      ? styles.sidebarSection
                      : styles.sidebarSectionLast
                  }
                >
                  <Text style={styles.sidebarTitle}>Languages</Text>
                  {languages.map((lang, i) => (
                    <Text key={i} style={styles.sidebarLang}>
                      {lang.language} — {lang.level}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

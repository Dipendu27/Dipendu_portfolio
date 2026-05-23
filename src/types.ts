export interface Skill {
  name: string;
  level: "Expert" | "Advanced" | "Intermediate";
  description: string;
  snippetTitle?: string;
  snippetCode?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  skills: Skill[];
}

export interface BugReport {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  component: string;
  stepsToReproduce: string[];
  expectedResult: string;
  actualResult: string;
  status: "RESOLVED" | "VERIFIED" | "IN_PROGRESS" | "OPEN";
  resolution: string;
}

export interface TestCase {
  id: string;
  feature: string;
  title: string;
  type: "Automation" | "Manual" | "Performance";
  status: "PASSED" | "FAILED" | "BLOCKED" | "UNTESTED";
  scriptLanguage?: string;
  scriptCode?: string;
}

export interface Contribution {
  metric: string;
  value: string;
  title: string;
  description: string;
}

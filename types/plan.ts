export interface LessonStage {
  key: 'engage' | 'explore' | 'explain' | 'elaborate' | 'evaluate';
  name: string;
  durationMinutes: number;
  objective: string;
  teacherAction: string;
  studentAction: string;
  hookQuestion?: string;
  activityDetails?: string;
  scientificExplanations?: string;
  transferChallenge?: string;
  exitTicketQuestions?: string[];
  materials?: string[];
}

export interface TableIdea {
  tableNumber: number;
  title: string;
  description: string;
  targetStyle: string;
}

export interface RubricItem {
  criterion: string;
  proficient: string;
  developing: string;
}

export interface Differentiation {
  support: string;
  enrichment: string;
}

export interface LessonPlan {
  lessonName: string;
  gradeLevel: string;
  subjectTopic: string;
  totalDurationMinutes: number;
  learningOutcomes: string[];
  pedagogicalGoal: string;
  keyConcepts: string[];
  misconceptions: string[];
  materialsNeeded: string[];
  stages: LessonStage[];
  table5Ideas: TableIdea[];
  differentiation: Differentiation;
  assessmentRubric: RubricItem[];
  teacherNotes: string;
  generatedAt?: string;
}

export interface GeneratePlanRequest {
  outcomesText: string;
  lessonName?: string;
  gradeLevel?: string;
  subjectTopic?: string;
  additionalNotes?: string;
}

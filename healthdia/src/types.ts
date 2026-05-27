/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AcademicRole = 'admin' | 'editor' | 'reviewer' | 'researcher' | 'student';

export interface AcademicPaper {
  id: string; // e.g., HD-RES-10294
  titleEN: string;
  titleAR: string;
  abstractEN: string;
  abstractAR: string;
  authorsEN: string[];
  authorsAR: string[];
  journalEN: string;
  journalAR: string;
  publishedAt: string;
  categoryEN: string;
  categoryAR: string;
  doi: string;
  methodologyEN: string;
  methodologyAR: string;
  resultsEN: string;
  resultsAR: string;
  discussionEN: string;
  discussionAR: string;
  citationCount: number;
  views: number;
  downloads: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string; // User Serial Number (e.g., HD-USR-58210)
  submittedByName: string;
  editorNotes?: string;
  keywordsEN: string[];
  keywordsAR: string[];
  seoTitle?: string;
  seoDescription?: string;
  methodologyAudited?: boolean;
  auditedBy?: string;
  auditNotes?: string;

  // Dual-Stream Track Fields
  submissionTrack?: 'repository' | 'journal'; // 'repository' = Track A: Research Bank, 'journal' = Track B: Healthedia Journal
  originalJournal?: string;
  originalPubDate?: string;
  originalLink?: string;
  originalCopyrightStatus?: string;
  licensingAgreementSigned?: boolean;
  ethicsAgreementSigned?: boolean;
  reviewerAssignments?: string[]; // ID list of assigned peer reviewers
  journalCertifiedWeightApplied?: boolean; // Applied higher rank multiplier
}

export interface WikipediaEdit {
  id: string; // e.g., HD-EDT-49102
  paperId: string;
  paperTitleEN: string;
  paperTitleAR: string;
  suggestedBy: string; // User Serial Number (e.g., HD-USR-49102)
  suggestedByName: string;
  section: 'abstract' | 'methodology' | 'results' | 'discussion';
  originalText: string;
  proposedText: string;
  justification: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string; // Admin/Editor identifier (User Serial Number)
  reviewedByName?: string;
  reviewedAt?: string;
  editorFeedback?: string;
  methodologyAudited?: boolean;
  auditedBy?: string;
  auditNotes?: string;
}

export interface SentEmail {
  id: string; // e.g., HD-EML-89102
  recipient: string;
  subject: string;
  body: string;
  sentAt: string;
  type: 'registration' | 'submission' | 'peer_review' | 'editorial';
}

export interface UserProfile {
  id: string; // Permanent Unique Serial Number, e.g., HD-USR-91024
  email: string;
  name: string;
  nameAR?: string;
  institution: string;
  institutionAR?: string;
  role: AcademicRole;
  isPublic: boolean;
  contributionsCount: number;
  registeredAt: string;
  bio?: string;
  bioAR?: string;
  username?: string; // Handle between 4 and 20 characters
  password?: string; // Max 30 characters
  credentials?: string; // e.g., "M.D., Ph.D."
  credentialsAR?: string;
  professionalHistory?: string;
  professionalHistoryAR?: string;
  
  // Custom verification characteristics
  avatarUrl?: string;
  isEmailDomainVerified?: boolean;
  isDigitallyVerified?: boolean; // Cryptographic verification badge (professional black check)
  academicMetrics?: {
    citations: number;
    hIndex: number;
    papersCount: number;
  };
  orcidId?: string;
  pubmedId?: string;
  googleScholarId?: string;
  
  // High trust enrollment portal assets
  verificationIDStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  uploadedIDUrl?: string;
  uploadedPassportUrl?: string;
  extractedVerificationData?: {
    extractedName: string;
    extractedInstitution: string;
    nameMatched: boolean;
    institutionMatched: boolean;
    confidence: number;
  };
}

export interface GlobalSettings {
  typography: 'sans' | 'serif' | 'mono';
  fontSizeScale: number; // e.g. 1.0, 1.1, 1.2
  highPerformanceMode: boolean;
  allowOpenContributions: boolean;
  colorTheme: 'monochrome' | 'high-contrast-dark' | 'sand-editorial';
  layoutSpacing: 'compact' | 'comfortable' | 'relaxed';
}

export interface InstitutionReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerNameAR?: string;
  reviewerRole: string;
  affiliationType: 'student' | 'faculty' | 'alumni' | 'researcher';
  curriculumRating: number; // 1-5
  facilitiesRating: number; // 1-5
  researchSupportRating: number; // 1-5
  comment: string;
  commentAR?: string;
  timestamp: string;
  isVerified: boolean;
  verificationLevel: 'HE-TRUST' | 'PROVISIONAL' | 'SELF-CLAIM';
}

export interface Institution {
  id: string;
  name: string;
  nameAR: string;
  logoLetters: string;
  flag: string;
  country: string;
  countryAR: string;
  region: 'North America' | 'Europe' | 'Middle East' | 'Asia';
  regionAR: string;
  studentBody: number;
  facultyCount: number;
  baseCitations: number;
  baseResearchOutput: number;
  disciplines: ('Medicine' | 'Public Health' | 'Clinical Research' | 'Human Performance' | 'Bio-Medical Engineering')[];
  summaryEN: string;
  summaryAR: string;
  reviews: InstitutionReview[];
}

export type Role = 'TEACHER' | 'VALIDATOR' | 'ADMIN';

export type MaterialStatus = 'DRAFT' | 'SUBMITTED' | 'NEEDS_REVISION' | 'APPROVED' | 'REJECTED';

export type GradeYear = 'YEAR_1' | 'YEAR_2' | 'YEAR_3' | 'YEAR_4' | 'YEAR_5';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isPreApproved: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  gradeYear: GradeYear;
  bnccCode: string;
  subjectId: string;
  subject?: Subject;
  fileUrl: string;
  fileKey: string;
  fileSize: number;
  fileMimeType: string;
  status: MaterialStatus;
  authorId: string;
  author?: User;
  reviews?: Review[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Review {
  id: string;
  materialId: string;
  material?: Material;
  validatorId: string;
  validator?: User;
  status: MaterialStatus;
  feedback?: string | null;
  createdAt: Date | string;
}

export interface AuditLog {
  id: string;
  userId: string;
  user?: User;
  action: string;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date | string;
}

export interface DashboardStats {
  totalMaterials: number;
  approvedMaterials: number;
  pendingReviews: number;
  totalTeachers: number;
}

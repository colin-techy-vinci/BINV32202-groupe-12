export const APPLICATION_STATUSES = ["IN_PROGRESS", "SELECTED", "REJECTED", "WITHDRAWN"] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type PeriodCode = "P1" | "P2" | "OTHER";

export interface ApplicationDbo {
  id: number;
  offer_id: number;
  student_id: number;
  title: string;
  company_short_name: string;
  academic_year_label: string;
  period_code: PeriodCode;
  message: string | null;
  status: ApplicationStatus;
  applied_at: string;
}

export interface Application {
  id: number;
  offerId: number;
  studentId: number;
  title: string;
  companyShortName: string;
  academicYear: string;
  period: PeriodCode;
  message: string | null;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface ApplicationDto {
  id: number;
  offerId: number;
  title: string;
  companyShortName: string;
  academicYear: string;
  period: PeriodCode;
  message: string | null;
  status: ApplicationStatus;
  appliedAt: string;
}

import type { Application, ApplicationDbo, ApplicationDto } from "../models/application.ts";

export const toApplication = (dbo: ApplicationDbo): Application => ({
  id: dbo.id,
  offerId: dbo.offer_id,
  studentId: dbo.student_id,
  title: dbo.title,
  companyShortName: dbo.company_short_name,
  academicYear: dbo.academic_year_label,
  period: dbo.period_code,
  message: dbo.message,
  status: dbo.status,
  appliedAt: dbo.applied_at,
});

export const toApplicationDto = (application: Application): ApplicationDto => ({
  id: application.id,
  offerId: application.offerId,
  title: application.title,
  companyShortName: application.companyShortName,
  academicYear: application.academicYear,
  period: application.period,
  message: application.message,
  status: application.status,
  appliedAt: application.appliedAt,
});

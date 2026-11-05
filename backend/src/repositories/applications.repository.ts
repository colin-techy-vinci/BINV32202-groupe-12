import type { Db } from "../db/database.ts";
import type { ApplicationDbo, ApplicationStatus } from "../models/application.ts";

interface ApplicationParams {
  studentId: number;
  offerId: number;
}

interface InsertParams {
  offerId: number;
  studentId: number;
  message: string | null;
}

export const createApplicationsRepository = (db: Db) => {
  const findStudentApplications = db.prepare<{ studentId: number }, ApplicationDbo>(`
    SELECT a.id, a.offer_id, a.student_id, o.title,
           c.short_name AS company_short_name, ay.label AS academic_year_label,
           p.code AS period_code, a.message, a.status, a.applied_at
    FROM applications a
    JOIN offers o ON o.id = a.offer_id
    JOIN companies c ON c.id = o.company_id
    JOIN academic_years ay ON ay.id = o.academic_year_id
    JOIN periods p ON p.id = o.period_id
    WHERE a.student_id = @studentId AND ay.is_current = 1
    ORDER BY a.applied_at DESC, a.id DESC
  `);

  const findByOfferAndStudent = db.prepare<ApplicationParams, ApplicationDbo | undefined>(`
    SELECT a.id, a.offer_id, a.student_id, o.title,
           c.short_name AS company_short_name, ay.label AS academic_year_label,
           p.code AS period_code, a.message, a.status, a.applied_at
    FROM applications a
    JOIN offers o ON o.id = a.offer_id
    JOIN companies c ON c.id = o.company_id
    JOIN academic_years ay ON ay.id = o.academic_year_id
    JOIN periods p ON p.id = o.period_id
    WHERE a.offer_id = @offerId AND a.student_id = @studentId
    ORDER BY a.id DESC
    LIMIT 1
  `);

  const findByIdAndStudent = db.prepare<{ id: number; studentId: number }, ApplicationDbo | undefined>(`
    SELECT a.id, a.offer_id, a.student_id, o.title,
           c.short_name AS company_short_name, ay.label AS academic_year_label,
           p.code AS period_code, a.message, a.status, a.applied_at
    FROM applications a
    JOIN offers o ON o.id = a.offer_id
    JOIN companies c ON c.id = o.company_id
    JOIN academic_years ay ON ay.id = o.academic_year_id
    JOIN periods p ON p.id = o.period_id
    WHERE a.id = @id AND a.student_id = @studentId
  `);

  const offerExistsAndIsPublished = db.prepare<{ offerId: number }, { id: number }>(`
    SELECT id FROM offers WHERE id = @offerId AND status = 'PUBLISHED'
  `);

  const insertApplication = db.prepare<InsertParams, { id: number }>(`
    INSERT INTO applications (offer_id, student_id, message)
    VALUES (@offerId, @studentId, @message)
    RETURNING id
  `);

  const withdrawApplication = db.prepare<{ id: number; studentId: number }, { status: ApplicationStatus }>(`
    UPDATE applications
    SET status = 'WITHDRAWN'
    WHERE id = @id AND student_id = @studentId AND status = 'IN_PROGRESS'
    RETURNING status
  `);

  return {
    findStudentApplications: (studentId: number): ApplicationDbo[] =>
      findStudentApplications.all({ studentId }),
    findByOfferAndStudent: (offerId: number, studentId: number): ApplicationDbo | undefined =>
      findByOfferAndStudent.get({ offerId, studentId }),
    findByIdAndStudent: (id: number, studentId: number): ApplicationDbo | undefined =>
      findByIdAndStudent.get({ id, studentId }),
    offerExistsAndIsPublished: (offerId: number): boolean =>
      offerExistsAndIsPublished.get({ offerId }) !== undefined,
    insert: (offerId: number, studentId: number, message: string | null): number =>
      insertApplication.get({ offerId, studentId, message })!.id,
    withdraw: (id: number, studentId: number): boolean =>
      withdrawApplication.get({ id, studentId }) !== undefined,
  };
};

export type ApplicationsRepository = ReturnType<typeof createApplicationsRepository>;

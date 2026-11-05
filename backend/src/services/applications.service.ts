import { toApplication } from "../mappers/application.mapper.ts";
import type { Application } from "../models/application.ts";
import type { ApplicationsRepository } from "../repositories/applications.repository.ts";
import type { User } from "../models/user.ts";
import { HttpError } from "../utils/httpError.ts";
import { isStudent } from "./permissions.ts";

const requireStudentId = (viewer: User): number => {
  if (!isStudent(viewer)) {
    throw new HttpError(403, "FORBIDDEN", "Seul un étudiant peut gérer ses candidatures");
  }
  return viewer.id;
};

export const createApplicationsService = (repository: ApplicationsRepository) => ({
  listApplications: (viewer: User): Application[] =>
    repository.findStudentApplications(requireStudentId(viewer)).map(toApplication),

  apply: (viewer: User, offerId: number, message: string | null): Application => {
    const studentId = requireStudentId(viewer);
    if (!repository.offerExistsAndIsPublished(offerId)) {
      throw new HttpError(404, "OFFER_NOT_FOUND", "Cette offre n'est pas publiée ou n'existe pas");
    }

    const previous = repository.findByOfferAndStudent(offerId, studentId);
    if (previous !== undefined && previous.status !== "WITHDRAWN") {
      throw new HttpError(409, "APPLICATION_EXISTS", "Vous avez déjà candidaté à cette offre");
    }

    const id = repository.insert(offerId, studentId, message);
    const application = repository.findByIdAndStudent(id, studentId);
    if (application === undefined) {
      throw new HttpError(500, "INTERNAL_ERROR", "La candidature créée est introuvable");
    }
    return toApplication(application);
  },

  withdraw: (viewer: User, id: number): void => {
    const studentId = requireStudentId(viewer);
    const application = repository.findByIdAndStudent(id, studentId);
    if (application === undefined) {
      throw new HttpError(404, "APPLICATION_NOT_FOUND", "Candidature introuvable");
    }
    if (application.status !== "IN_PROGRESS") {
      throw new HttpError(409, "APPLICATION_NOT_WITHDRAWABLE", "Cette candidature a déjà été traitée");
    }
    if (!repository.withdraw(id, studentId)) {
      throw new HttpError(409, "APPLICATION_NOT_WITHDRAWABLE", "Cette candidature a déjà été traitée");
    }
  },
});

export type ApplicationsService = ReturnType<typeof createApplicationsService>;

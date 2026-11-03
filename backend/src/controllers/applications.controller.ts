import { Router } from "express";
import { toApplicationDto } from "../mappers/application.mapper.ts";
import { getCurrentUser } from "../middlewares/authenticate.ts";
import type { ApplicationsService } from "../services/applications.service.ts";
import { authorize } from "../middlewares/authorize.ts";
import { HttpError } from "../utils/httpError.ts";
import { canManageApplications } from "../services/permissions.ts";

const parsePositiveInteger = (value: string, label: string): number => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, "INVALID_PARAMETER", `${label} doit être un entier positif`);
  }
  return parsed;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseApplicationBody = (body: unknown): { offerId: number; message: string | null } => {
  if (!isRecord(body)) {
    throw new HttpError(400, "INVALID_BODY", "Le corps doit contenir offerId et message");
  }
  const offerId = body.offerId;
  if (typeof offerId !== "number" || !Number.isInteger(offerId) || offerId <= 0) {
    throw new HttpError(400, "INVALID_BODY", "offerId doit être un entier positif");
  }
  if (body.message !== undefined && body.message !== null && typeof body.message !== "string") {
    throw new HttpError(400, "INVALID_BODY", "message doit être une chaîne de caractères");
  }
  const message = typeof body.message === "string" ? body.message.trim() : null;
  return { offerId, message: message === "" ? null : message };
};

export const createApplicationsRouter = (applicationsService: ApplicationsService) => {
  const router = Router();
  router.use(authorize(canManageApplications));

  router.get("/", (req, res) => {
    res.json(applicationsService.listApplications(getCurrentUser(req)).map(toApplicationDto));
  });

  router.post("/", (req, res) => {
    const { offerId, message } = parseApplicationBody(req.body);
    res.status(201).json(
      toApplicationDto(applicationsService.apply(getCurrentUser(req), offerId, message)),
    );
  });

  router.delete("/:id", (req, res) => {
    applicationsService.withdraw(
      getCurrentUser(req),
      parsePositiveInteger(req.params.id, "L'identifiant de candidature"),
    );
    res.status(204).send();
  });

  return router;
};

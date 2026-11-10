import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { APPLICATION, OFFER, STUDENT } from "../src/db/seed/seedIds.ts";
import { createTestApp, tokenFor } from "./helpers/testApp.ts";
import { createTestDatabase } from "./helpers/testDatabase.ts";

let app: ReturnType<typeof createTestApp>;

beforeEach(() => {
  app = createTestApp();
});

const studentToken = tokenFor("STUDENT", STUDENT.LUCAS_DUPONT);

describe("candidatures étudiantes", () => {
  it("liste uniquement les candidatures de l'étudiant connecté", async () => {
    const response = await request(app).get("/applications").set("Authorization", studentToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        id: APPLICATION.LUCAS_FLEET_APP,
        offerId: OFFER.FLEET_APP,
        title: "Application React de gestion de flotte",
        status: "IN_PROGRESS",
      }),
    ]);
  });

  it("refuse l'accès aux profils non étudiants", async () => {
    const response = await request(app)
      .get("/applications")
      .set("Authorization", tokenFor("ADMIN", 1));

    expect(response.status).toBe(403);
  });

  it("crée une candidature avec un message facultatif", async () => {
    const response = await request(app)
      .post("/applications")
      .set("Authorization", studentToken)
      .send({ offerId: OFFER.DATA_QUALITY, message: "Mon expérience en qualité de données." });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        offerId: OFFER.DATA_QUALITY,
        message: "Mon expérience en qualité de données.",
        status: "IN_PROGRESS",
      }),
    );
  });

  it("refuse une candidature sur une offre non publiée et les doublons actifs", async () => {
    const notPublished = await request(app)
      .post("/applications")
      .set("Authorization", studentToken)
      .send({ offerId: OFFER.CLIENT_PORTAL });
    expect(notPublished.status).toBe(404);

    const duplicate = await request(app)
      .post("/applications")
      .set("Authorization", studentToken)
      .send({ offerId: OFFER.FLEET_APP });
    expect(duplicate.status).toBe(409);
  });

  it("refuse une offre inexistante et un message invalide", async () => {
    const missingOffer = await request(app)
      .post("/applications")
      .set("Authorization", studentToken)
      .send({ offerId: 999, message: "Message valide" });
    expect(missingOffer.status).toBe(404);
    expect(missingOffer.body.error.code).toBe("OFFER_NOT_FOUND");

    const invalidMessage = await request(app)
      .post("/applications")
      .set("Authorization", studentToken)
      .send({ offerId: OFFER.DATA_QUALITY, message: 123 });
    expect(invalidMessage.status).toBe(400);
    expect(invalidMessage.body.error.code).toBe("INVALID_BODY");
  });

  it("refuse les opérations de candidature d'un profil non étudiant", async () => {
    const adminToken = tokenFor("ADMIN", 1);
    const create = await request(app)
      .post("/applications")
      .set("Authorization", adminToken)
      .send({ offerId: OFFER.DATA_QUALITY });
    expect(create.status).toBe(403);

    const withdraw = await request(app)
      .delete(`/applications/${APPLICATION.LUCAS_FLEET_APP}`)
      .set("Authorization", adminToken);
    expect(withdraw.status).toBe(403);
  });

  it("ne liste que les candidatures de l'année académique courante", async () => {
    const db = createTestDatabase();
    db.prepare(
      `INSERT INTO applications (offer_id, student_id, message, status, applied_at)
       VALUES (?, ?, ?, ?, ?)`,
    ).run(OFFER.PDF_REPORTS, STUDENT.LUCAS_DUPONT, null, "IN_PROGRESS", "2025-10-01 10:00:00");
    const appWithHistoricalApplication = createTestApp(db);

    const response = await request(appWithHistoricalApplication)
      .get("/applications")
      .set("Authorization", studentToken);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: APPLICATION.LUCAS_FLEET_APP,
        academicYear: "2026-2027",
      }),
    );
  });

  it("retourne le statut retenu dans la liste des candidatures", async () => {
    const response = await request(app)
      .get("/applications")
      .set("Authorization", tokenFor("STUDENT", STUDENT.MATEUSZ_KOWALSKI));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        id: APPLICATION.MATEUSZ_CLOUD_MIGRATION,
        status: "SELECTED",
      }),
    ]);
  });

  it("retire une candidature en cours et permet de recandidater", async () => {
    const withdrawal = await request(app)
      .delete(`/applications/${APPLICATION.LUCAS_FLEET_APP}`)
      .set("Authorization", studentToken);
    expect(withdrawal.status).toBe(204);

    const reapply = await request(app)
      .post("/applications")
      .set("Authorization", studentToken)
      .send({ offerId: OFFER.FLEET_APP });
    expect(reapply.status).toBe(201);
  });

  it("refuse le retrait d'une candidature traitée ou d'un autre étudiant", async () => {
    const processed = await request(app)
      .delete(`/applications/${APPLICATION.MATEUSZ_CLOUD_MIGRATION}`)
      .set("Authorization", tokenFor("STUDENT", STUDENT.MATEUSZ_KOWALSKI));
    expect(processed.status).toBe(409);

    const otherStudent = await request(app)
      .delete(`/applications/${APPLICATION.LUCAS_FLEET_APP}`)
      .set("Authorization", tokenFor("STUDENT", STUDENT.INES_HADDAD));
    expect(otherStudent.status).toBe(404);
  });
});

import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { APPLICATION, OFFER, STUDENT } from "../src/db/seed/seedIds.ts";
import { createTestApp, tokenFor } from "./helpers/testApp.ts";

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

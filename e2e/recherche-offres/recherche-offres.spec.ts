import { expect, test, type Page } from "@playwright/test";

const LUCAS_DUPONT = "Lucas Dupont";

const openOffersAsLucas = async (page: Page) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: LUCAS_DUPONT })
    .click();
  await page.getByRole("link", { name: "Offres", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Offres de stage" })).toBeVisible();
};

test("Scénario 1 - recherche nominale avec une offre publiée", async ({ page }) => {
  await openOffersAsLucas(page);

  await expect(page.getByText("Les offres publiées.", { exact: true })).toBeVisible();
  await expect(page.getByText("4 offres", { exact: true })).toBeVisible();

  const searchResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/api/offers") &&
      new URL(response.url()).searchParams.get("q") === "api rest",
  );

  await page.getByRole("searchbox", { name: "Rechercher par titre" }).fill("  api rest  ");
  await searchResponse;

  await expect(page.getByText("1 offre", { exact: true })).toBeVisible();

  const rows = page.getByRole("row");
  await expect(rows).toHaveCount(2);

  const matchingRow = page.getByRole("row").filter({
    has: page.getByRole("cell", { name: "API REST de facturation", exact: true }),
  });
  await expect(matchingRow).toHaveCount(1);
  await expect(matchingRow.getByRole("cell", { name: "Orbis", exact: true })).toBeVisible();
  await expect(matchingRow.getByRole("cell", { name: "2026-2027", exact: true })).toBeVisible();
  await expect(matchingRow.getByRole("cell", { name: "P2", exact: true })).toBeVisible();
  await expect(matchingRow.getByRole("cell", { name: "Publiée", exact: true })).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "Application React de gestion de flotte", exact: true }),
  ).toHaveCount(0);
});

test("Scénario 2 - recherche sans résultat visible", async ({ page }) => {
  await openOffersAsLucas(page);

  await expect(page.getByText("Les offres publiées.", { exact: true })).toBeVisible();

  const searchResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/api/offers") &&
      new URL(response.url()).searchParams.get("q") === "portail client",
  );

  await page
    .getByRole("searchbox", { name: "Rechercher par titre" })
    .fill("portail client");
  await searchResponse;

  await expect(
    page.getByText("Aucune offre ne correspond à la recherche.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("table")).toHaveCount(0);
  await expect(page.getByText(/\d+ offres?/, { exact: true })).toHaveCount(0);
  await expect(page.getByRole("cell", { name: "Refonte du portail client", exact: true })).toHaveCount(0);
  await expect(page.getByRole("cell", { name: "API REST de facturation", exact: true })).toHaveCount(0);
});

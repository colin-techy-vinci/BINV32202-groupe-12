import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ApplicationsPage from "../src/pages/ApplicationsPage.tsx";
import { stubFetch } from "./helpers/fetchMock.ts";

const applications = [
  {
    id: 1,
    offerId: 1,
    title: "Application React de gestion de flotte",
    companyShortName: "Lumen Digital",
    academicYear: "2026-2027",
    period: "P2",
    message: null,
    status: "IN_PROGRESS",
    appliedAt: "2026-10-02 18:10:00",
  },
  {
    id: 2,
    offerId: 3,
    title: "API REST de facturation",
    companyShortName: "Orbis",
    academicYear: "2026-2027",
    period: "P2",
    message: null,
    status: "REJECTED",
    appliedAt: "2026-09-30 10:30:00",
  },
];

describe("ApplicationsPage", () => {
  it("affiche les statuts et retire une candidature en cours", async () => {
    stubFetch({
      "/api/applications/1": () => new Response(null, { status: 204 }),
      "/api/applications": () => Response.json(applications),
    });

    render(<ApplicationsPage token="jeton" onUnauthorized={vi.fn()} />);

    expect(await screen.findByText("En cours")).toBeInTheDocument();
    expect(screen.getByText("Non retenue")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Retirer" }));

    await waitFor(() => expect(screen.getByText("Retirée")).toBeInTheDocument());
    expect(screen.queryByRole("button", { name: "Retirer" })).not.toBeInTheDocument();
  });
});

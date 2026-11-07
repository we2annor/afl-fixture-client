import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./page";
import type { FixtureResponse } from "@/lib/types";

function makeFixture(): FixtureResponse {
  return {
    competitionName: "AFL Premiership",
    phases: [
      {
        rounds: [
          {
            code: "R1",
            number: 1,
            name: "Round 1",
            matches: [
              {
                id: 1,
                roundOrder: 1,
                type: { id: 1, name: "Home and Away", code: "HA" },
                squads: {
                  home: { id: 10, code: "RIC", name: "Richmond" },
                  away: { id: 20, code: "CAR", name: "Carlton" },
                },
                date: {
                  startDate: "2026-03-01",
                  startTime: "19:30",
                  utcMatchStart: "2026-03-01T08:30:00Z",
                },
                venue: {
                  id: 100,
                  code: "MCG",
                  name: "MCG",
                  timeZone: "Australia/Melbourne",
                },
                status: { name: "Scheduled", code: "SCHED" },
              },
            ],
          },
          {
            code: "R2",
            number: 2,
            name: "Round 2",
            matches: [
              {
                id: 2,
                roundOrder: 1,
                type: { id: 1, name: "Home and Away", code: "HA" },
                squads: {
                  home: { id: 30, code: "ESS", name: "Essendon" },
                  away: { id: 40, code: "HAW", name: "Hawthorn" },
                },
                date: {
                  startDate: "2026-03-08",
                  startTime: "19:30",
                  utcMatchStart: "2026-03-08T08:30:00Z",
                },
                venue: {
                  id: 200,
                  code: "MARV",
                  name: "Marvel Stadium",
                  timeZone: "Australia/Melbourne",
                },
                status: { name: "Scheduled", code: "SCHED" },
              },
            ],
          },
        ],
      },
    ],
  };
}

function renderHome() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const user = userEvent.setup();
  const view = render(
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
  return { user, ...view };
}

// Rendered in DOM order: RoundFilter, VenueFilter, TeamFilter (see app/page.tsx).
function getFilterComboboxes() {
  const [round, venue, team] = screen.getAllByRole("combobox");
  return { round, venue, team };
}

// Scopes match-presence assertions to the rendered match grid, since a
// selected option's text can otherwise linger in a not-yet-unmounted
// dropdown popup in jsdom (no real transitionend events).
function matchList() {
  return within(screen.getByTestId("match-list"));
}

describe("Home page (integration)", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => makeFixture(),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("fetches the fixture and renders every match once loaded", async () => {
    renderHome();

    expect(await screen.findByText("Richmond")).toBeInTheDocument();
    expect(matchList().getByText("Essendon")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("filters the match list down to the selected round", async () => {
    const { user } = renderHome();
    await screen.findByText("Richmond");

    const { round } = getFilterComboboxes();
    await user.click(round);
    await user.click(await screen.findByRole("option", { name: "Round 2" }));

    expect(matchList().queryByText("Richmond")).not.toBeInTheDocument();
    expect(matchList().getByText("Essendon")).toBeInTheDocument();
  });

  it("filters the match list down to the selected team", async () => {
    const { user } = renderHome();
    await screen.findByText("Richmond");

    const { team } = getFilterComboboxes();
    await user.click(team);
    await user.click(await screen.findByRole("option", { name: "Carlton" }));

    expect(matchList().getByText("Richmond")).toBeInTheDocument();
    expect(matchList().queryByText("Essendon")).not.toBeInTheDocument();
  });

  it("filters the match list down to the selected venue", async () => {
    const { user } = renderHome();
    await screen.findByText("Richmond");

    const { venue } = getFilterComboboxes();
    await user.click(venue);
    await user.click(await screen.findByRole("option", { name: "Marvel Stadium" }));

    expect(matchList().queryByText("Richmond")).not.toBeInTheDocument();
    expect(matchList().getByText("Essendon")).toBeInTheDocument();
  });

  it("shows an empty-state message when no match satisfies the combined filters", async () => {
    const { user } = renderHome();
    await screen.findByText("Richmond");

    const { round, team } = getFilterComboboxes();
    await user.click(round);
    await user.click(await screen.findByRole("option", { name: "Round 1" }));
    await user.click(team);
    await user.click(await screen.findByRole("option", { name: "Essendon" }));

    expect(
      await screen.findByText("No matches for this selection")
    ).toBeInTheDocument();
  });

  it("shows an error message when the fixture request fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    renderHome();

    expect(
      await screen.findByText("Fixture request failed: 500")
    ).toBeInTheDocument();
  });
});

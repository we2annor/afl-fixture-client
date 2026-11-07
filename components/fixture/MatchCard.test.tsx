import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatchCard } from "./MatchCard";
import type { FlatMatch } from "@/lib/fixture";

function makeMatch(overrides: Partial<FlatMatch> = {}): FlatMatch {
  return {
    id: 1,
    roundNumber: 1,
    roundName: "Round 1",
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
    venue: { id: 100, code: "MCG", name: "MCG", timeZone: "Australia/Melbourne" },
    status: { name: "Scheduled", code: "SCHED" },
    ...overrides,
  };
}

describe("MatchCard", () => {
  it("renders both team names, the venue, and the formatted kickoff time", () => {
    render(<MatchCard match={makeMatch()} />);

    expect(screen.getByText("Richmond")).toBeInTheDocument();
    expect(screen.getByText("Carlton")).toBeInTheDocument();
    expect(screen.getByText("MCG")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
  });

  it("falls back to TBC labels when a team or venue is not yet known", () => {
    render(
      <MatchCard
        match={makeMatch({
          squads: { home: undefined, away: undefined },
          venue: undefined,
        })}
      />
    );

    expect(screen.getAllByText("TBC")).toHaveLength(2);
    expect(screen.getByText("Venue TBC")).toBeInTheDocument();
  });

  it("falls back to 'Date TBC' when the match has no date", () => {
    render(
      <MatchCard
        match={makeMatch({ date: undefined as unknown as FlatMatch["date"] })}
      />
    );

    expect(screen.getByText("Date TBC")).toBeInTheDocument();
  });

  it("shows the score once both teams have one", () => {
    render(
      <MatchCard
        match={makeMatch({
          squads: {
            home: {
              id: 10,
              code: "RIC",
              name: "Richmond",
              score: { goals: 10, behinds: 5, points: 65 },
            },
            away: {
              id: 20,
              code: "CAR",
              name: "Carlton",
              score: { goals: 8, behinds: 6, points: 54 },
            },
          },
        })}
      />
    );

    expect(screen.getByText("65 - 54")).toBeInTheDocument();
  });

  it("shows 'Not yet played' when a score is missing", () => {
    render(<MatchCard match={makeMatch()} />);

    expect(screen.getByText("Not yet played")).toBeInTheDocument();
  });
});

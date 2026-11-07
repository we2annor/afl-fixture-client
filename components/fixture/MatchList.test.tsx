import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatchList } from "./MatchList";
import type { FlatMatch } from "@/lib/fixture";

function makeMatch(id: number): FlatMatch {
  return {
    id,
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
  };
}

describe("MatchList", () => {
  it("renders loading skeletons while pending", () => {
    const { container } = render(
      <MatchList matches={undefined} isPending={true} isError={false} error={null} />
    );

    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });

  it("renders the error message when the query fails", () => {
    render(
      <MatchList
        matches={undefined}
        isPending={false}
        isError={true}
        error={new Error("Fixture request failed: 500")}
      />
    );

    expect(screen.getByText("Fixture request failed: 500")).toBeInTheDocument();
  });

  it("renders a generic error message when the error is not an Error instance", () => {
    render(
      <MatchList matches={undefined} isPending={false} isError={true} error={"oops"} />
    );

    expect(
      screen.getByText("something went wrong loading the fixture.")
    ).toBeInTheDocument();
  });

  it("renders an empty-state message when there are no matches", () => {
    render(<MatchList matches={[]} isPending={false} isError={false} error={null} />);

    expect(screen.getByText("No matches for this selection")).toBeInTheDocument();
  });

  it("renders a MatchCard per match", () => {
    render(
      <MatchList
        matches={[makeMatch(1), makeMatch(2)]}
        isPending={false}
        isError={false}
        error={null}
      />
    );

    expect(screen.getAllByText("Richmond")).toHaveLength(2);
  });
});

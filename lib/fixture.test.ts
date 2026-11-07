import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  fetchFixture,
  flattenFixture,
  getRounds,
  getTeams,
  getVenues,
  type FlatMatch,
} from "./fixture";
import type { FixtureResponse, Match } from "./types";

function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
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
    venue: { id: 100, code: "MCG", name: "MCG", timeZone: "Australia/Melbourne" },
    status: { name: "Scheduled", code: "SCHED" },
    ...overrides,
  };
}

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
              makeMatch({ id: 1 }),
              makeMatch({
                id: 2,
                squads: {
                  home: { id: 30, code: "ESS", name: "Essendon" },
                  away: { id: 40, code: "BYE", name: "Bye" },
                },
                venue: undefined,
              }),
            ],
          },
          {
            code: "R2",
            number: 2,
            name: "Round 2",
            matches: [
              makeMatch({
                id: 3,
                squads: {
                  home: { id: 10, code: "RIC", name: "Richmond" },
                  away: { id: 30, code: "ESS", name: "Essendon" },
                },
                venue: { id: 200, code: "MARV", name: "Marvel Stadium", timeZone: "Australia/Melbourne" },
              }),
            ],
          },
        ],
      },
    ],
  };
}

describe("flattenFixture", () => {
  it("flattens every round across every phase into a single list, tagged with round info", () => {
    const flat = flattenFixture(makeFixture());

    expect(flat).toHaveLength(3);
    expect(flat.map((m) => m.id)).toEqual([1, 2, 3]);
    expect(flat[0]).toMatchObject({ roundNumber: 1, roundName: "Round 1" });
    expect(flat[2]).toMatchObject({ roundNumber: 2, roundName: "Round 2" });
  });
});

describe("getRounds", () => {
  it("returns distinct rounds sorted by round number", () => {
    const flat = flattenFixture(makeFixture());
    expect(getRounds(flat)).toEqual([
      { number: 1, name: "Round 1" },
      { number: 2, name: "Round 2" },
    ]);
  });

  it("dedupes repeated round numbers, keeping the first name seen", () => {
    const matches: FlatMatch[] = [
      { ...makeMatch({ id: 1 }), roundNumber: 1, roundName: "Round 1" },
      { ...makeMatch({ id: 2 }), roundNumber: 1, roundName: "Round 1" },
    ];
    expect(getRounds(matches)).toEqual([{ number: 1, name: "Round 1" }]);
  });
});

describe("getVenues", () => {
  it("returns distinct venues sorted alphabetically, skipping matches with no venue", () => {
    const flat = flattenFixture(makeFixture());
    expect(getVenues(flat)).toEqual([
      { id: 200, name: "Marvel Stadium" },
      { id: 100, name: "MCG" },
    ]);
  });
});

describe("getTeams", () => {
  it("returns distinct teams sorted alphabetically, deduping home/away appearances", () => {
    const flat = flattenFixture(makeFixture());
    const teams = getTeams(flat);

    expect(teams).toEqual([
      { id: 20, name: "Carlton" },
      { id: 30, name: "Essendon" },
      { id: 10, name: "Richmond" },
    ]);
  });

  it("excludes squads coded as BYE", () => {
    const flat = flattenFixture(makeFixture());
    expect(flat.find((m) => m.id === 2)!.squads.away!.code).toBe("BYE");
    expect(getTeams(flat).some((t) => t.name === "Bye")).toBe(false);
  });

  it("ignores matches with no home or away squad", () => {
    const matches: FlatMatch[] = [
      { ...makeMatch({ id: 1, squads: {} }), roundNumber: 1, roundName: "Round 1" },
    ];
    expect(getTeams(matches)).toEqual([]);
  });
});

describe("fetchFixture", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns the parsed JSON body on a successful response", async () => {
    const body = makeFixture();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => body,
    });

    await expect(fetchFixture()).resolves.toEqual(body);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://0p0s8y841d.execute-api.ap-southeast-2.amazonaws.com/test/react-code-test/fixture"
    );
  });

  it("throws with the status code when the response is not ok", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    });

    await expect(fetchFixture()).rejects.toThrow("Fixture request failed: 503");
  });
});

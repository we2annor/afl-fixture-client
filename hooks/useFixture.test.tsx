import { describe, expect, it, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { useFixture } from "./useFixture";
import * as fixtureLib from "@/lib/fixture";
import type { FixtureResponse } from "@/lib/types";

vi.mock("@/lib/fixture", async () => {
  const actual = await vi.importActual<typeof fixtureLib>("@/lib/fixture");
  return { ...actual, fetchFixture: vi.fn() };
});

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
                venue: { id: 100, code: "MCG", name: "MCG", timeZone: "Australia/Melbourne" },
                status: { name: "Scheduled", code: "SCHED" },
              },
            ],
          },
        ],
      },
    ],
  };
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("useFixture", () => {
  beforeEach(() => {
    vi.mocked(fixtureLib.fetchFixture).mockReset();
  });

  it("flattens the fetched fixture into FlatMatch[] once loaded", async () => {
    vi.mocked(fixtureLib.fetchFixture).mockResolvedValue(makeFixture());

    const { result } = renderHook(() => useFixture(), { wrapper });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.data).toEqual([
      expect.objectContaining({ id: 1, roundNumber: 1, roundName: "Round 1" }),
    ]);
  });

  it("surfaces a fetch failure as isError", async () => {
    vi.mocked(fixtureLib.fetchFixture).mockRejectedValue(
      new Error("Fixture request failed: 500")
    );

    const { result } = renderHook(() => useFixture(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(new Error("Fixture request failed: 500"));
  });
});

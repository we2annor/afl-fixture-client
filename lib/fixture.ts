import { FixtureResponse, Match, Squad } from "./types";

export async function fetchFixture(): Promise<FixtureResponse> {
  const res = await fetch(
    "https://0p0s8y841d.execute-api.ap-southeast-2.amazonaws.com/test/react-code-test/fixture"
  );
  if (!res.ok) {
    throw new Error(`Fixture request failed: ${res.status}`);
  }
  return res.json();
}

export type FlatMatch = Match & { roundNumber: number; roundName: string };

export function flattenFixture(data: FixtureResponse): FlatMatch[] {
  return data.phases.flatMap((phase) =>
    phase.rounds.flatMap((round) =>
      round.matches.map((match) => ({
        ...match,
        roundNumber: round.number,
        roundName: round.name,
      }))
    )
  );
}

export function getRounds(matches: FlatMatch[]) {
  const map = new Map<number, string>();
  for (const match of matches) {
    if (!map.has(match.roundNumber)) {
      map.set(match.roundNumber, match.roundName);
    }
  }
  return Array.from(map.entries())
    .map(([number, name]) => ({ number, name }))
    .sort((a, b) => a.number - b.number);
}

export function getVenues(matches: FlatMatch[]) {
  const map = new Map<number, string>();
  for (const match of matches) {
    if (!match.venue) continue;
    if (!map.has(match.venue.id)) {
      map.set(match.venue.id, match.venue.name);
    }
  }
  return Array.from(map.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getTeams(matches: FlatMatch[]) {
  const map = new Map<number, string>();

  function addTeam(team?: Squad) {
    if (!team || team.code === "BYE") return;
    if (!map.has(team.id)) {
      map.set(team.id, team.name);
    }
  }
  for (const match of matches) {
    addTeam(match.squads.home);
    addTeam(match.squads.away);
  }

  return Array.from(map.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

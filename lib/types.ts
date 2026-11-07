export interface FixtureResponse {
  competitionName: string;
  phases: Phase[];
}

export interface Phase {
  rounds: Round[];
}

export interface Round {
  code: string;
  number: number;
  name: string;
  matches: Match[];
}

export interface Match {
  id: number;
  roundOrder: number;
  type: { id: number; name: string; code: string };
  squads: { home?: Squad; away?: Squad };
  date: { startDate: string; startTime: string; utcMatchStart: string };
  venue?: { id: number; code: string; name: string; timeZone: string };
  status: { name: string; code: string };
}

export interface Squad {
  id: number;
  code: string;
  name: string;
  score?: { goals: number; behinds: number; points: number };
}

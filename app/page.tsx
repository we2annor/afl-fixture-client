"use client";

import { MatchList } from "@/components/fixture/MatchList";
import { RoundFilter } from "@/components/fixture/RoundFilter";
import { TeamFilter } from "@/components/fixture/TeamFilter";
import { VenueFilter } from "@/components/fixture/VenueFilter";
import { useFixture } from "@/hooks/useFixture";
import { getRounds, getTeams, getVenues } from "@/lib/fixture";
import { useMemo, useState } from "react";

export default function Home() {
  const { data, isPending, isError, error } = useFixture();
  const [round, setRound] = useState<number | null>(null);
  const [venue, setVenue] = useState<number | null>(null);
  const [team, setTeam] = useState<number | null>(null);

  const rounds = useMemo(() => (data ? getRounds(data) : []), [data]);
  const venues = useMemo(() => (data ? getVenues(data) : []), [data]);
  const teams = useMemo(() => (data ? getTeams(data) : []), [data]);

  const filtered = useMemo(() => {
    return (
      data?.filter(
        (m) =>
          (round === null || m.roundNumber === round) &&
          (venue === null || m.venue?.id === venue) &&
          (team === null ||
            m.squads.home?.id === team ||
            m.squads.away?.id === team)
      ) ?? []
    );
  }, [data, round, venue, team]);

  return (
    <main className='mx-auto w-full max-w-5xl flex-1 px-4 py-6'>
      <div className='mb-4 flex flex-col gap-2 md:flex-row md:items-center'>
        <RoundFilter rounds={rounds} value={round} onChange={setRound} />
        <VenueFilter venues={venues} value={venue} onChange={setVenue} />
        <TeamFilter teams={teams} value={team} onChange={setTeam} />
      </div>
      <MatchList
        matches={filtered}
        isPending={isPending}
        isError={isError}
        error={error}
      />
    </main>
  );
}

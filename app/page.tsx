"use client";

import { MatchList } from "@/components/fixture/MatchList";
import { Pagination } from "@/components/fixture/Pagination";
import { RoundFilter } from "@/components/fixture/RoundFilter";
import { TeamFilter } from "@/components/fixture/TeamFilter";
import { VenueFilter } from "@/components/fixture/VenueFilter";
import { useFixture } from "@/hooks/useFixture";
import { getRounds, getTeams, getVenues } from "@/lib/fixture";
import { useMemo, useRef, useState } from "react";

const PAGE_SIZE = 15;

export default function Home() {
  const { data, isPending, isError, error } = useFixture();
  const [round, setRound] = useState<number | null>(null);
  const [venue, setVenue] = useState<number | null>(null);
  const [team, setTeam] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState([round, venue, team]);

  const listRef = useRef<HTMLDivElement>(null);

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

  if (
    appliedFilters[0] !== round ||
    appliedFilters[1] !== venue ||
    appliedFilters[2] !== team
  ) {
    setAppliedFilters([round, venue, team]);
    setPage(1);
  }

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className='mx-auto w-full max-w-5xl flex-1 px-4 py-6'>
      <div className='mb-4 flex flex-col gap-2 md:flex-row md:items-center'>
        <RoundFilter rounds={rounds} value={round} onChange={setRound} />
        <VenueFilter venues={venues} value={venue} onChange={setVenue} />
        <TeamFilter teams={teams} value={team} onChange={setTeam} />
      </div>
      <div ref={listRef}>
        <MatchList
          matches={paginated}
          isPending={isPending}
          isError={isError}
          error={error}
        />
      </div>
      <Pagination
        page={page}
        pageCount={pageCount}
        onChange={handlePageChange}
      />
    </main>
  );
}

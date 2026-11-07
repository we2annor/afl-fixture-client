import { FlatMatch } from "@/lib/fixture";
import { Skeleton } from "../ui/skeleton";
import { MatchCard } from "./MatchCard";

type MatchListProps = {
  matches: FlatMatch[] | undefined;
  isPending: boolean;
  isError: boolean;
  error: unknown;
};

export function MatchList({
  matches,
  isPending,
  isError,
  error,
}: MatchListProps) {
  if (isPending) {
    return (
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='h-32 w-full' />
        ))}
      </div>
    );
  }

  if (isError) {
    const message =
      error instanceof Error
        ? error.message
        : "something went wrong loading the fixture.";
    return <p className='text-sm text-destructive'>{message}</p>;
  }

  if (!matches || matches.length === 0) {
    return (
      <p className='text-sm text-muted-foreground'>
        No matches for this selection
      </p>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}

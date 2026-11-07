"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlatMatch } from "@/lib/fixture";
import { useState } from "react";

// Decorative: the team name is already shown as visible text next to this
// logo, so the image (and its error fallback) are hidden from assistive tech
// to avoid announcing the team name twice.
function TeamLogo({ code }: { code: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return <span aria-hidden='true'>{code}</span>;
  }
  return (
    <Image
      src={logoUrl(code)}
      alt=''
      width={32}
      height={32}
      onError={() => setErrored(true)}
    />
  );
}

function logoUrl(code: string) {
  return `https://react-code-test.s3.ap-southeast-2.amazonaws.com/logos/${code}.svg`;
}

export function MatchCard({ match }: { match: FlatMatch }) {
  const { squads, venue, status, date } = match;
  const kickoff = date
    ? new Date(date.utcMatchStart).toLocaleString("en-AU", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Date TBC";

  return (
    <Card className='w-full'>
      <CardHeader className='grid grid-cols-[1fr_auto_1fr] items-center gap-2'>
        <div className='flex min-w-0 items-center justify-end gap-2'>
          <span className='truncate font-medium'>
            {squads.home?.name ?? "TBC"}
          </span>
          {squads.home && <TeamLogo code={squads.home.code} />}
        </div>
        <span className='text-sm text-muted-foreground'>vs</span>
        <div className='flex min-w-0 items-center gap-2'>
          {squads.away && <TeamLogo code={squads.away.code} />}
          <span className='truncate font-medium'>
            {squads.away?.name ?? "TBC"}
          </span>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-1 text-sm text-muted-foreground'>
        <span>{kickoff}</span>
        <span>{venue?.name ?? "Venue TBC"}</span>
      </CardContent>
      <CardFooter className='flex items-center justify-between'>
        {squads.home?.score && squads.away?.score ? (
          <span className='font-semibold'>
            {squads.home.score.points} - {squads.away.score.points}
          </span>
        ) : (
          <span className='text-sm text-muted-foreground'>Not yet played</span>
        )}
        <Badge variant={status.code === "COMP" ? "secondary" : "outline"}>
          {status.name}
        </Badge>
      </CardFooter>
    </Card>
  );
}

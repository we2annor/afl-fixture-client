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
import { Squad } from "@/lib/types";
import { useState } from "react";

function TeamLogo({ code, name }: { code: string; name: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return <span>{code}</span>;
  }
  return (
    <Image
      src={logoUrl(code)}
      alt={name}
      width={32}
      height={32}
      onError={() => setErrored(true)}
    />
  );
}

function logoUrl(code: string) {
  return `https://react-code-test.s3.ap-southeast-2.amazonaws.com/logos/${code}.svg`;
}

function TeamDisplay({
  team,
  align,
}: {
  team: Squad | undefined;
  align: "left" | "right";
}) {
  if (!team) {
    return <span className='text-sm text-muted-foreground'>TBC</span>;
  }
  const logo = <TeamLogo code={team.code} name={team.name} />;
  const name = <span className='font-medium'>{team.name}</span>;
  return (
    <div className='flex items-center gap-2'>
      {align === "left" ? (
        <>
          {logo}
          {name}
        </>
      ) : (
        <>
          {name}
          {logo}
        </>
      )}
    </div>
  );
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
          {squads.home && (
            <TeamLogo code={squads.home.code} name={squads.home.name} />
          )}
        </div>
        {/* <TeamDisplay team={squads.home} align='left' /> */}
        <span className='text-sm text-muted-foreground'>vs</span>
        {/* <TeamDisplay team={squads.away} align='right' /> */}
        <div className='flex min-w-0 items-center gap-2'>
          {squads.away && (
            <TeamLogo code={squads.away.code} name={squads.away.name} />
          )}
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

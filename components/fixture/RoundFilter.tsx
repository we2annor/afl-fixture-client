"use client";

import { useId } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RoundFilterProps = {
  rounds: { number: number; name: string }[];
  value: number | null;
  onChange: (value: number | null) => void;
};

export function RoundFilter({ rounds, value, onChange }: RoundFilterProps) {
  const triggerId = useId();
  const selectedLabel =
    value === null
      ? "All rounds"
      : rounds.find((r) => r.number === value)?.name;
  return (
    <div className='flex flex-col gap-1'>
      <Label htmlFor={triggerId}>Filter by Rounds</Label>
      <Select
        value={value === null ? "all" : String(value)}
        onValueChange={(v) => onChange(v === "all" ? null : Number(v))}
      >
        <SelectTrigger id={triggerId} className='w-full md:w-48'>
          <SelectValue placeholder='All rounds'>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All rounds</SelectItem>
          {rounds.map((round) => (
            <SelectItem key={round.number} value={String(round.number)}>
              {round.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

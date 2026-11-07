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

type TeamFilterProps = {
  teams: { id: number; name: string }[];
  value: number | null;
  onChange: (value: number | null) => void;
};

export function TeamFilter({ teams, value, onChange }: TeamFilterProps) {
  const triggerId = useId();
  const selectedLabel =
    value === null ? "All Teams" : teams.find((t) => t.id === value)?.name;
  return (
    <div className='flex flex-col gap-1'>
      <Label htmlFor={triggerId}>Filter by Teams</Label>
      <Select
        value={value === null ? "all" : String(value)}
        onValueChange={(v) => onChange(v === "all" ? null : Number(v))}
      >
        <SelectTrigger id={triggerId} className='w-full md:w-48'>
          <SelectValue placeholder='All Teams'>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Teams</SelectItem>
          {teams.map((team) => (
            <SelectItem key={team.id} value={String(team.id)}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

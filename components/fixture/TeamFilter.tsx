"use client";

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
  const selectedLabel =
    value === null ? undefined : teams.find((t) => t.id === value)?.name;
  return (
    <Select
      value={value === null ? "All Teams" : String(value)}
      onValueChange={(v) => onChange(v === "all" ? null : Number(v))}
    >
      <SelectTrigger className='w-full md:w-48'>
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
  );
}

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

type VenueFilterProps = {
  venues: { id: number; name: string }[];
  value: number | null;
  onChange: (value: number | null) => void;
};

export function VenueFilter({ venues, value, onChange }: VenueFilterProps) {
  const triggerId = useId();
  const selectedLabel =
    value === null ? "All venues" : venues.find((v) => v.id === value)?.name;
  return (
    <div className='flex flex-col gap-1'>
      <Label htmlFor={triggerId}>Filter by Venue</Label>
      <Select
        value={value === null ? "all" : String(value)}
        onValueChange={(v) => onChange(v === "all" ? null : Number(v))}
      >
        <SelectTrigger id={triggerId} className='w-full md:w-48'>
          <SelectValue placeholder='All venues'>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All venues</SelectItem>
          {venues.map((venue) => (
            <SelectItem key={venue.id} value={String(venue.id)}>
              {venue.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

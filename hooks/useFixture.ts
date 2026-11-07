import { useQuery } from "@tanstack/react-query";
import { fetchFixture, flattenFixture } from "@/lib/fixture";

export function useFixture() {
  return useQuery({
    queryKey: ["fixture"],
    queryFn: fetchFixture,
    select: flattenFixture,
    staleTime: 60 * 60 * 1000,
  });
}

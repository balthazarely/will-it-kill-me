import { useQuery } from "@tanstack/react-query";

export interface HallOfShameProduct {
  barcode: string;
  name: string;
  brand: string;
  image: string;
  score: number;
  verdict: string;
  flags: string[];
  scan_count: number;
  additives_count: number;
  danger_score: number;
}

const fetchHallOfShame = async (): Promise<HallOfShameProduct[]> => {
  const res = await fetch(
    "https://i9bha5wbmb.execute-api.us-east-2.amazonaws.com/hall-of-shame"
  );
  if (!res.ok) throw new Error("Failed to fetch hall of shame");
  return res.json();
};

export const useHallOfShame = () => {
  return useQuery({
    queryKey: ["hall-of-shame"],
    queryFn: fetchHallOfShame,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};


export class TournamentDto {
  id!: string;
  completed!: boolean;
  name!: string;
  latestRound!: string;
  finalRound!: number;
  highestCompletedRound!: number;
  pdgaLastUpdate!: string | null;
  rounds!: number;
  startDate!: string[];
  endDate!: string[];
}

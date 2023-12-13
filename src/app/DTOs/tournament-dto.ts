import { Expose } from 'class-transformer';

export class TournamentDto {
  @Expose() id!: string;
  @Expose() completed!: boolean;
  @Expose() name!: string;
  @Expose() latestRound!: string;
  @Expose() finalRound!: number;
  @Expose() highestCompletedRound!: number;
  @Expose() pdgaLastUpdate!: string | null;
  @Expose() rounds!: number;
  @Expose() startDate!: string[];
  @Expose() endDate!: string[];
}

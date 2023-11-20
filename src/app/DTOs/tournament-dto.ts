import { Type, Expose } from 'class-transformer';

export class TournamentDto {
  @Expose() id!: string;
  @Expose() finished!: boolean;
  @Expose() name!: string;
  @Expose() latestRound!: string;
  @Expose() finalRound!: number;
  @Expose() highestCompletedRound!: number;
  @Expose() rounds!: number;
  @Expose() divisionAbbrvList!: string[];
}

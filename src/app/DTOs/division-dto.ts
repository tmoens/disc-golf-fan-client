import { Type, Expose } from 'class-transformer';
import { TournamentDto } from './tournament-dto';
import 'reflect-metadata';

export class DivisionDto {
  @Expose() name!: string;
  @Expose() id!: number;
  @Expose() tournamentId!: string;
  @Expose() fullName!: string;
  @Expose() latestRound!: string;
  @Expose() finalRound!: string;
  @Expose() completed!: boolean;
  @Expose() pdgaLastUpdate!: string;

  @Type(() => TournamentDto)
  @Expose() tournament!: TournamentDto;
}

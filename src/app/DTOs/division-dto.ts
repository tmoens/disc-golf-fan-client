import { Type, Expose } from 'class-transformer';
import { TournamentDto } from './tournament-dto';
import 'reflect-metadata';

export class DivisionDto {
  @Expose() liveRoundId!: number;
  @Expose() name!: string;
  @Expose() tournamentId!: string;
  @Expose() round!: string;
  @Expose() isFinished!: boolean;
  @Expose() holeNames!: string[];
  @Expose() holeLengths!: number[];
  @Expose() holePars!: number[];
  @Expose() pdgaLastUpdate!: string;

  @Type(() => TournamentDto)
  @Expose() tournament!: TournamentDto;
}

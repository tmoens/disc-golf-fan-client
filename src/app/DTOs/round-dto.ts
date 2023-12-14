import 'reflect-metadata';
import {Expose, Type} from 'class-transformer';
import {DivisionDto} from './division-dto';

export class RoundDto {
  @Expose() liveRoundId!: number;
  @Expose() divisionName!: string;
  @Expose() tournamentId!: number;
  @Expose() roundName!: string;
  @Expose() completed!: boolean;
  @Expose() holeNames!: string[];
  @Expose() holeLengths!: number[];
  @Expose() holePars!: number[];
  @Expose() pdgaLastUpdate!: string;

  @Type(() => DivisionDto)
  @Expose() division!: DivisionDto;
}

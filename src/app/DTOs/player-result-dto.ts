import {Expose, Type} from 'class-transformer';
import 'reflect-metadata';
import {RoundDto} from './round-dto';

export class PlayerResultDto {
  @Expose() resultId!: number;
  @Expose() pdgaNum!: number;
  @Expose() playerName!: string;
  @Expose() rating!: number;
  @Expose() holes!: number;
  @Expose() previousRoundsTotal!: number;
  @Expose() grandTotal!: number;
  @Expose() runningPlace!: number;
  @Expose() tied!: boolean;
  @Expose() played!: number;
  @Expose() roundToPar!: number;
  @Expose() parThroughRound!: number;
  @Expose() roundScore!: number;
  @Expose() roundRating!: number;
  @Expose() holeScores!: string;
  @Expose() pdgaLastUpdate!: string;

  @Type(() => PlayerResultDto)
  @Expose() leader!: PlayerResultDto;

  @Type(() => RoundDto)
  @Expose() round!: RoundDto;
}

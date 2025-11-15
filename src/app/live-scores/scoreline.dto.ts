import {Expose, Type} from 'class-transformer';
import 'reflect-metadata';
import {RoundDto} from './round.dto';

/**
 * A player's scoreline for the current live round, including totals and per-hole scores.
 * Joined with RoundDto for per-hole metadata.
 */
export class ScorelineDto {
  @Expose() resultId!: number;
  @Expose() liveRoundId!: number;
  @Expose() pdgaNum!: number;
  @Expose() playerName!: string;
  @Expose() rating!: number | null;
  @Expose() holes!: number;
  @Expose() previousRoundsTotal!: number;
  @Expose() grandTotal!: number;
  @Expose() runningPlace!: number;
  @Expose() previousPlace!: number | null;
  @Expose() tied!: boolean;
  @Expose() played!: number | null;
  @Expose() roundToPar!: number;
  @Expose() parThroughRound!: number;
  @Expose() roundScore!: number;
  @Expose() roundRating!: number | null;
  @Expose() holeScores!: number[];
  @Expose() pdgaLastUpdate!: string | null;
  @Expose() completed!: boolean;

  @Type(() => RoundDto)
  @Expose() round!: RoundDto;
}

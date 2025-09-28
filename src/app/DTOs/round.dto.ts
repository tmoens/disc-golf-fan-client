import 'reflect-metadata';
import {Expose, Type} from 'class-transformer';
import {DivisionDto} from './division.dto';

/**
 * Metadata for a single round, including per-hole details and leader info.
 * Used to enrich ScorelineDto with context (pars, lengths, averages, etc).
 */
export class RoundDto {
  @Expose() liveRoundId!: number;
  @Expose() divisionName!: string;
  @Expose() tournamentId!: number;
  @Expose() roundName!: string;
  @Expose() roundNumber: number = 0;
  @Expose() completed!: boolean;
  @Expose() holeNames!: string[];
  @Expose() holeLengths!: number[];
  @Expose() holePars!: number[];
  @Expose() leaderScores!: number[];
  @Expose() leaderPlayed!: number | null;
  @Expose() leaderRoundToPar!: number | null;
  @Expose() leaderParThroughRound!: number | null;
  @Expose() averageScores!: number[];
  @Expose() playCount!: number[];

  @Expose() pdgaLastUpdate!: string;

  @Type(() => DivisionDto)
  @Expose() division!: DivisionDto;
}

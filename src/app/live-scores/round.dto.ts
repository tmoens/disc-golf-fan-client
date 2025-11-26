import {DivisionDto} from './division.dto';

/**
 * Metadata for a single round, including per-hole details and leader info.
 * Used to enrich ScorelineDto with context (pars, lengths, averages, etc).
 */
export class RoundDto {
  liveRoundId!: number;
  divisionName!: string;
  tournamentId!: number;
  roundName!: string;
  roundNumber: number = 0;
  completed!: boolean;
  holeNames!: string[];
  holeLengths!: number[];
  holePars!: number[];
  leaderScores!: number[];
  leaderPlayed!: number | null;
  leaderRoundToPar!: number | null;
  leaderParThroughRound!: number | null;
  averageScores!: number[];
  playCount!: number[];
  pdgaLastUpdate!: string;
  division!: DivisionDto;
}

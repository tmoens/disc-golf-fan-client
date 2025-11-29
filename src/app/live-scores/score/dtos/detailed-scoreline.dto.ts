import {RoundDto} from './round.dto';

/**
 * A player's scoreline for the current live round, including totals and per-hole scores.
 * Joined with RoundDto for per-hole metadata.
 */
export class DetailedScorelineDto {
  resultId!: number;
  liveRoundId!: number;
  pdgaNum!: number;
  playerName!: string;
  rating!: number | null;
  holes!: number;
  previousRoundsTotal!: number;
  grandTotal!: number;
  runningPlace!: number;
  previousPlace!: number | null;
  tied!: boolean;
  played!: number | null;
  roundToPar!: number;
  parThroughRound!: number;
  roundScore!: number;
  roundRating!: number | null;
  holeScores!: number[];
  pdgaLastUpdate!: string | null;
  completed!: boolean;

  round!: RoundDto;
}

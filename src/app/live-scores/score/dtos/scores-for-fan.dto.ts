export type ScoresForFanDto = ScoresForFavouritePlayerDto[];

export interface ScoresForFavouritePlayerDto {
  playerId: number;
  playerName: string;
  tournaments: TournamentForFanDto[];
}

export interface TournamentForFanDto {
  tournamentId: number;
  tournamentName: string;
  divisions: DivisionForFanDto[];
}

export interface DivisionForFanDto {
  divisionName: string;
  rounds: RoundForFanDto[];
}

export interface RoundForFanDto {
  roundNumber: number;
  liveRoundId: number | null;
  scorelines: ScorelineForFanDto[];
}

export interface ScorelineForFanDto {
  resultId: number | null;
  runningPlace: number | null;
  tied: boolean | null;
  played: boolean | null;
  roundToPar: number | null;
  parThroughRound: number | null;
  roundScore: number | null;
  roundRating: number | null;
}

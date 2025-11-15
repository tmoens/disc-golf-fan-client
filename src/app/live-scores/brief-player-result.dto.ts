
export class BriefPlayerResultDto {
  liveRoundId!: number;
  resultId!: number;
  pdgaNum!: number;
  playerName!: string;
  runningPlace!: number;
  tied!: boolean;
  // number of holes played
  played!: number;
  roundToPar!: number;
  // The running total vs par for the tournament.,
  parThroughRound!: number;
  roundScore!: number;
  roundRating!: number;
  roundNumber!: string;
  divisionName!: string;
  tournamentName!: string;
  tournamentId!: string;
}

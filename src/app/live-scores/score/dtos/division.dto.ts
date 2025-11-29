import { TournamentDto } from './tournament.dto';

export class DivisionDto {
  name!: string;
  id!: number;
  tournamentId!: string;
  fullName!: string;
  latestRound!: string;
  finalRound!: string;
  completed!: boolean;
  pdgaLastUpdate!: string;
  tournament!: TournamentDto;
}

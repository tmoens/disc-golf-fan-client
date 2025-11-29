import {MiniTournamentDto} from './mini-tournament.dto';

export class UpcomingTournamentsDto {
  id!: number;
  name!: string;
  upcomingTournaments!: MiniTournamentDto[];
}

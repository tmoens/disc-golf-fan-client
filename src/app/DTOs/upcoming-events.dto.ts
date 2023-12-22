import {MiniTournamentDto} from './mini-tournament.dto';

export class UpcomingEventsDto {
  id!: number;
  name!: string;
  nickname?: string;
  upcomingTournaments!: MiniTournamentDto[];
}

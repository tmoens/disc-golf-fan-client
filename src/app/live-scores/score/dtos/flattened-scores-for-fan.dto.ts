import { DivisionForFanDto, ScoresForFavouritePlayerDto, TournamentForFanDto } from './scores-for-fan.dto';

export interface FlattenedScoreRow {
  favourite: ScoresForFavouritePlayerDto;
  tournament: TournamentForFanDto;
  division: DivisionForFanDto;
}

export function flattenFavouriteScores(
  favourites: ScoresForFavouritePlayerDto[]
): FlattenedScoreRow[] {

  const flattened: FlattenedScoreRow[] = [];

  favourites.forEach((fav, favIndex) => {
    fav.tournaments.forEach(tournament => {
      tournament.divisions.forEach(division => {
        flattened.push({
          favourite: fav,
          tournament,
          division,
        });
      });
    });
  });

  return flattened;
}

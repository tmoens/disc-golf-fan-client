import {Expose, Type} from 'class-transformer';
import 'reflect-metadata';
import {FavouriteDto} from './favourite.dto';
import {UserDto} from './user.dto';

export class FanDto {
  public id!: string;

  @Type(() => UserDto)
  public user!: UserDto;

  @Type(() => FavouriteDto)
  public favourites: FavouriteDto[] = [];

  hasFavourites(): boolean {
    return this.favourites.length > 0;
  }

  hasFavourite(playerId: number): FavouriteDto | undefined {
    return this.favourites.find(favourite => favourite.playerId === playerId);
  }
}

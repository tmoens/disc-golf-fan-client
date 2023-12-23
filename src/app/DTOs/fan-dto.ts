import {Expose, Type} from 'class-transformer';
import 'reflect-metadata';
import {FavouriteDto} from './favourite-dto';
import {UserDto} from './user-dto';

export class FanDto {
  @Expose() public id!: string;

  @Type(() => UserDto)
  @Expose() public user!: UserDto;

  @Type(() => FavouriteDto)
  @Expose() public favourites: FavouriteDto[] = [];

  isFavourite(playerId: number): boolean {
    for (const f of this.favourites) {
      if (f.playerId === playerId) {
        return true;
      }
    }
    return false;
  }
}

import {Expose, Type} from 'class-transformer';
import 'reflect-metadata';
import {FavouriteDto} from './favourite-dto';

export class FanDto {
  @Expose() public id!: number;
  @Expose() public username!: string;
  @Expose() public name!: string;

  @Type(() => FavouriteDto)
  @Expose() public favourites: FavouriteDto[] = [];

  isFavourite(playerId: string): boolean {
    for (const f of this.favourites) {
      if (f.playerId === playerId) {
        return true;
      }
    }
    return false;
  }

  sortFavourites() {
    this.favourites.sort((a, b) => a.order - b.order);
  }
}

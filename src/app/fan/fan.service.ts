import {effect, Injectable, signal} from '@angular/core';
import {plainToInstance} from 'class-transformer';
import {of, switchMap, tap} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {FanDto} from './dtos/fan.dto';
import {LoaderService} from '../loader.service';
import {ReorderFavouriteDto} from './dtos/reorder-favourite.dto';
import {FavouriteDto} from './dtos/favourite.dto';
import {AddFavouriteDto} from './dtos/add-favourite.dto';

@Injectable({
  providedIn: 'root'
})
export class FanService {
  fanSignal = signal<FanDto | null>(null);

  fan: FanDto | null = this.fanSignal();

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
  ) {
    effect(() => {
      const userId = this.authService.authenticatedUserId();
      if (userId) {
        this.loadFanAfterLogin(userId);
      } else {
        this.fanSignal.set(null);
      }
    });
  }

  private loadFanAfterLogin(fanId: string) {
    this.loaderService.getFanById(fanId).subscribe(data => {
      const fanDto = data ? plainToInstance(FanDto, data) : null;
      this.fanSignal.set(fanDto);
    });
  }

  private reload$() {
    const fanId = this.authService.getAuthenticatedUserId();
    if (!fanId) return of(null);

    return this.loaderService.getFanById(fanId).pipe(
      tap(data => {
        const fanDto = data ? plainToInstance(FanDto, data) : null;
        this.fanSignal.set(fanDto);
      })
    );
  }

  isPlayerAFavourite(playerId: number): FavouriteDto | undefined {
    return this.fanSignal()?.favourites.find(f => f.playerId === playerId);
  }

  fanHasFavourites(): boolean {
    return !!this.fanSignal()?.favourites.length;
  }

  addFavourite(dto: AddFavouriteDto) {
    return this.loaderService.addFavourite(dto)
      .pipe(switchMap(() => this.reload$()));
  }

  deleteFavourite(dto: FavouriteDto) {
    return this.loaderService.deleteFavourite(dto)
      .pipe(switchMap(() => this.reload$()));
  }

  updateFavourite(dto: FavouriteDto) {
    return this.loaderService.updateFavourite(dto)
      .pipe(switchMap(() => this.reload$()));
  }

  moveFavourite(previousIndex: number, currentIndex: number) {   // translate the drag from index to a player
    const fan = this.fanSignal();
    if (!fan) return;

    const playerIdToBeMoved = fan.favourites[previousIndex];
    const playerIdTarget = fan.favourites[currentIndex];

    if (playerIdTarget && playerIdToBeMoved) {
      const reorderFavouriteDto =
        new ReorderFavouriteDto(fan.id, playerIdToBeMoved.playerId, playerIdTarget.playerId);
      if (previousIndex < currentIndex) {
        this.moveFavouriteAfter(reorderFavouriteDto);
      }
      if (previousIndex > currentIndex) {
        this.moveFavouriteBefore(reorderFavouriteDto);
      }
    }
  }

  moveFavouriteBefore(dto: ReorderFavouriteDto) {
    return this.loaderService.moveFavouriteBefore(dto).pipe(
      switchMap(() => this.reload$())
    );
  }

  moveFavouriteAfter(dto: ReorderFavouriteDto) {
    return this.loaderService.moveFavouriteAfter(dto).pipe(
      switchMap(() => this.reload$())
    );
  }
}

import {Injectable, OnDestroy, signal, WritableSignal} from '@angular/core';
import {LoaderService} from '../loader.service';
import {FanDto} from '../DTOs/fan.dto';
import {plainToInstance} from 'class-transformer';
import {BriefPlayerResultDto} from '../DTOs/brief-player-result.dto';
import {AuthService} from '../auth/auth.service';
import {interval, lastValueFrom, Subscription} from 'rxjs';
import {AppTools} from '../shared/app-tools';
import {AppStateService} from '../app-state.service';
import {ReorderFavouriteDto} from '../DTOs/reorder-favourite.dto';

@Injectable({
  providedIn: 'root'
})
export class FanService {
  fan: FanDto | null = null;

  constructor(
    private appStateService: AppStateService,
    private authService: AuthService,
    private loaderService: LoaderService,
  ) {
  }

  async reload() {
    const fanId = this.authService.getAuthenticatedUserId();
    // if no one is logged in, there is no telling who we are supposed to load, so don't.
    if (!fanId) {
      this.fan = null;
      return
    }
    this.loaderService.getFanById(fanId).subscribe((data) => {
      if (data) {
        this.fan = plainToInstance(FanDto, data);
      } else {
        this.fan = null;
      }
    })
  }

  async moveFavouriteBefore(reorderFavouriteDto: ReorderFavouriteDto) {
    await lastValueFrom(this.loaderService.moveFavouriteBefore(reorderFavouriteDto));
    this.reload().then();
  }

  async moveFavouriteAfter(reorderFavouriteDto: ReorderFavouriteDto) {
    await lastValueFrom(this.loaderService.moveFavouriteAfter(reorderFavouriteDto));
    this.reload().then();
  }

  fanHasFavourites(): boolean {
    if (this.fan) {
      return this.fan.favourites.length > 0;
    } else {
      return false;
    }
  }
}

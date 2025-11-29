import {effect, Injectable, signal} from '@angular/core';
import {plainToInstance} from 'class-transformer';
import { EMPTY, Observable, of, map, switchMap, tap } from 'rxjs';
import {AuthService} from '../auth/auth.service';
import { ChangeEmailDto } from '../user-account-management/change-email.dto';
import { ChangeNameDto } from '../user-account-management/change-name.dto';
import {FanDto} from './dtos/fan.dto';
import {LoaderService} from '../loader.service';
import {ReorderFavouriteDto} from './dtos/reorder-favourite.dto';
import {FavouriteDto} from './dtos/favourite.dto';
import {AddFavouriteDto} from './dtos/add-favourite.dto';
import { UserDto } from './dtos/user.dto';

@Injectable({
  providedIn: 'root'
})
export class FanService {
  fanSignal = signal<FanDto | null>(null);

  fan: FanDto | null = this.fanSignal();

  constructor(
    private authService: AuthService,
    private loader: LoaderService,
  ) {
    effect(() => {
      const user = this.authService.authenticatedUser();
      if (user) {
        this.loadFanAfterLogin(user.id);
      } else {
        this.fanSignal.set(null);
      }
    });
  }

  private loadFanAfterLogin(fanId: string) {
    this.loader.getFanById(fanId).subscribe(data => {
      const fanDto = data ? plainToInstance(FanDto, data) : null;
      this.fanSignal.set(fanDto);
    });
  }

  private reload$() {
    const user = this.authService.authenticatedUser();
    if (!user) return of(null);

    return this.loader.getFanById(user.id).pipe(
      tap(data => {
        const fanDto = data ? plainToInstance(FanDto, data) : null;
        console.log('FanService: Reloaded fan', fanDto);
        this.fanSignal.set(fanDto);
      })
    );
  }

  addFavourite(dto: AddFavouriteDto) {
    return this.loader.addFavourite(dto)
      .pipe(switchMap(() => this.reload$()));
  }

  deleteFavourite(dto: FavouriteDto) {
    return this.loader.deleteFavourite(dto)
      .pipe(switchMap(() => this.reload$()));
  }

  updateFavourite(dto: FavouriteDto) {
    return this.loader.updateFavourite(dto)
      .pipe(switchMap(() => this.reload$()));
  }

  moveFavourite(
    favouriteId: number,
    targetFavouriteId: number,
    direction: 'before' | 'after'
  ) {
    const fan = this.fanSignal();
    if (!fan) return EMPTY;

    const dto = new ReorderFavouriteDto(fan.id, favouriteId, targetFavouriteId);

    const request$ =
      direction === 'before'
        ? this.loader.moveFavouriteBefore(dto)
        : this.loader.moveFavouriteAfter(dto);

    return request$.pipe(
      switchMap(() => this.reload$())
    );
  }

  deleteMyAccount(): Observable<UserDto | null> {
    return this.loader.deleteMyAccount();
  }

  changeMyEmail(dto: ChangeEmailDto): Observable<UserDto | null> {
    return this.loader.changeMyEmail(dto).pipe(
      switchMap((result: UserDto | null) =>
        this.reload$().pipe(
          // after reload completes, return the ORIGINAL result to the caller
          map(() => result)
        )
      )
    );
  }

  changeMyName(dto: ChangeNameDto): Observable<UserDto | null> {
    return this.loader.changeMyName(dto).pipe(
      switchMap((result: UserDto | null) =>
        this.reload$().pipe(
          // after reload completes, return the ORIGINAL result to the caller
          map(() => result)
        )
      )
    );
  }

  requestEmailConfirmationEmail(): Observable<string | null> {
    return this.loader.requestEmailConfirmationEmail();
  }
}

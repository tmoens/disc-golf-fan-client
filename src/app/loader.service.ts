import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, map, throwError, of} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError} from 'rxjs/operators';
import {environment} from '../environments/environment';
import { ForgotPasswordDto } from './auth/dtos/forgot-password-dto';
import { LoginDto } from './auth/dtos/login-dto';
import { LoginResponseDto } from './auth/dtos/login-response-dto';
import { RefreshAccessTokenResponseDto } from './auth/dtos/refresh-access-token-response-dto';
import { RegistrationDto } from './auth/dtos/registration-dto';
import { ResetPasswordDto } from './auth/dtos/reset-password-dto';
import {FanDto} from './fan/dtos/fan.dto';
import {PlayerDto} from './fan/dtos/player.dto';
import {AddFavouriteDto} from './fan/dtos/add-favourite.dto';
import {FavouriteDto} from './fan/dtos/favourite.dto';
import { UserDto } from './fan/dtos/user.dto';
import {DetailedScorelineDto} from './live-scores/score/dtos/detailed-scoreline.dto';
import { ScoresForFanDto } from './live-scores/score/dtos/scores-for-fan.dto';
import { SimpleHttpResponseDto } from './misc/simple-http-response.dto';
import {UpcomingTournamentsDto} from './upcoming-tournaments/upcoming-tournaments.dto';
import {ReorderFavouriteDto} from './fan/dtos/reorder-favourite.dto';
import { ChangeEmailDto } from './user-account-management/change-email.dto';
import { ChangeNameDto } from './user-account-management/change-name.dto';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  serverUrl: string;

  constructor(
    private http: HttpClient,
    private message: MatSnackBar,
  ) {

    if (environment.production) {
      this.serverUrl = location.origin + '/dg-fan-server';
    } else {
      this.serverUrl = environment.apiBaseUrl;
    }
  }

  getPlayerById(id: number): Observable<PlayerDto | null> {
    const url = `${this.serverUrl}/player/${id}`;
    return this.http.get<PlayerDto>(url)
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  getFanById(id: string): Observable<FanDto | null> {
    const url = `${this.serverUrl}/fan/${id}`;
    return this.http.get<FanDto>(url)
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  getScoresForFan(id: string): Observable<ScoresForFanDto | null> {
    const url = `${this.serverUrl}/fan/scores-for-fan/${id}`;
    return this.http.get<ScoresForFanDto>(url)
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }


  getDetailedScores(liveRoundId: number, resultId: number): Observable<DetailedScorelineDto | null> {
    const url = `${this.serverUrl}/scoreline/get-scoreline-detail/${liveRoundId}/${resultId}`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  getUpcomingEvents(fanId: string): Observable<UpcomingTournamentsDto[] | null> {
    const url = `${this.serverUrl}/favourite/get-upcoming-events/${fanId}`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, []))
      );
  }

  // ------------------------------ Managing Favourites ------------------------

  addFavourite(favourite: AddFavouriteDto): Observable<null> {
    const url = `${this.serverUrl}/add-favourite/`;
    return this.http.post<any>(url, favourite)
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  updateFavourite(favourite: FavouriteDto): Observable<FavouriteDto | null> {
    const url = `${this.serverUrl}/favourite/update/`;
    return this.http.post<any>(url, favourite)
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  moveFavouriteBefore(reorderFavouriteDto: ReorderFavouriteDto): Observable<FanDto | null> {
    const url = `${this.serverUrl}/fan/move-before`;
    return this.http.post<any>(url, reorderFavouriteDto)
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  moveFavouriteAfter(reorderFavouriteDto: ReorderFavouriteDto): Observable<FanDto | null> {
    const url = `${this.serverUrl}/fan/move-after`;
    return this.http.post<any>(url, reorderFavouriteDto)
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  deleteFavourite(favourite: FavouriteDto): Observable<null> {
    const url = `${this.serverUrl}/favourite/delete/${favourite.fanId}/${favourite.playerId}`;
    return this.http.delete<any>(url)
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  // ------------------------------ User Settings ------------------------------

  register(dto: RegistrationDto): Observable<UserDto | null> {
    const url = `${this.serverUrl}/user/register`;
    return this.http.post<UserDto>(url, dto).pipe(
      catchError(this.handleErrorsButThrowOn400(url, null))
    );
  }

  deleteMyAccount(): Observable<UserDto | null> {
    const url = `${this.serverUrl}/user/me`;
    return this.http.delete<UserDto>(url).pipe(
      catchError(this.handleErrorAndShowSnackbar(url, null))
    );
  }

  changeMyEmail(dto: ChangeEmailDto): Observable<UserDto | null> {
    const url = `${this.serverUrl}/user/me/email`;
    return this.http.patch<UserDto>(url, dto).pipe(
      catchError(this.handleErrorAndShowSnackbar(url, null))
    );
  }

  changeMyName(dto: ChangeNameDto): Observable<UserDto | null> {
    const url = `${this.serverUrl}/user/me/name`;
    return this.http.patch<UserDto>(url, dto).pipe(
      catchError(this.handleErrorAndShowSnackbar(url, null))
    );
  }

  forgotPassword(dto: ForgotPasswordDto): Observable<string | null> {
    const url = `${this.serverUrl}/user/forgot-password`;
    return this.http.put<SimpleHttpResponseDto>(url, dto).pipe(
      map(res => res.message),
      catchError(this.handleErrorsButThrowOn400(url, null))
    );
  }

  resetPassword(dto: ResetPasswordDto): Observable<UserDto | null> {
    const url = `${this.serverUrl}/user/reset-password`;
    return this.http.put<UserDto>(url, dto).pipe(
      catchError(this.handleErrorsButThrowOn400(url, null))
    );
  }

  confirmEmail(token: string): Observable<UserDto | null> {
    const url = `${this.serverUrl}/user/confirm-email/${token}`;
    return this.http.get<UserDto>(url).pipe(
      catchError(this.handleErrorAndShowSnackbar(url, null))
    );
  }

  requestEmailConfirmationEmail(): Observable<string | null> {
    const url = `${this.serverUrl}/user/request-email-confirmation-email`;
    return this.http.get<SimpleHttpResponseDto>(url).pipe(
      map(res => res.message),
      catchError(this.handleErrorAndShowSnackbar(url, null))
    )
  }


  // ------------------------------ Authentication related calls ------------------------------

  login(dto: LoginDto): Observable<LoginResponseDto | null> {
    const url = `${this.serverUrl}/auth/login`;
    return this.http.post<LoginResponseDto>(url, dto).pipe(
      catchError(this.handleErrorsButThrowOn400(url, null))
    );
  }

  logout(): Observable<string | null> {
    const url = `${this.serverUrl}/auth/logout`;
    return this.http.get<SimpleHttpResponseDto>(url).pipe(
      map(res => res.message),
      catchError(this.handleErrorAndShowSnackbar(url, null))
    );
  }

  refreshAccessToken(refreshHeader: HttpHeaders): Observable<RefreshAccessTokenResponseDto | null> {
    const url = `${this.serverUrl}/auth/refresh-access-token`;
    return this.http.get<RefreshAccessTokenResponseDto>(url, {
        headers: refreshHeader,
      })
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }


  /*
   * This generic handler was copied from the Angular tutorial.
   * And as a note to future, even thicker, self who will be going WTF?...
   * We use it to handle errors for all our http calls.  But all
   * our HTTP Calls return different types!  And the error handler
   * has to return the right type.  So, the error handler is
   * parameterized such that you can tell it what to return when
   * it is finished doing its business.
   */
  private handleErrorAndShowSnackbar<T>(_operation = 'operation', resultOnError?: T) {
    return (error: any): Observable<T | null> => {
      this.message.open(`${error.error.message} || ${error.status}`,
        'Dismiss', {duration: 5000});
      // }
      // Let the app keep running by returning what we were told to.
      return of(resultOnError as T);
    };
  }

  private handleErrorsButThrowOn400<T>(url: string, resultOnError: T) {
    return (error: any): Observable<T | null> => {

      if (error.status === 400) {
        const message =
          error?.error?.message ??
          error?.message ??
          'Invalid request';
        return throwError(() => message);
      }

      // all other errors behave like normal
      this.message.open(
        `${error?.error?.message || 'Request failed'} || ${error.status}`,
        'Dismiss',
        { duration: 5000 }
      );

      return of(resultOnError as T);
    };
  }
}

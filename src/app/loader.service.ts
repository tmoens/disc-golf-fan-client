import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {Router} from '@angular/router';
import {FanDto} from './DTOs/fan-dto';
import {PlayerDto} from './DTOs/player-dto';
import {AddFavouriteDto} from './DTOs/add-favourite-dto';
import {FavouriteDto} from './DTOs/favourite-dto';
import {PlayerResultDto} from './DTOs/player-result-dto';
import {BriefPlayerResultDto} from './DTOs/brief-player-result-dto';
import {RegistrationDto} from './DTOs/auth-related/registration-dto';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  serverUrl: string;

  constructor(
    private http: HttpClient,
    private message: MatSnackBar,
    private router: Router,
  ) {
    if (environment.production) {
      this.serverUrl = location.origin + '/dg-fan-server';
    } else {
      this.serverUrl = 'http://localhost:3000';
    }
  }

  getPlayerById( id: string): Observable<PlayerDto | null> {
    const url = `${this.serverUrl}/player/${id}`
    return this.http.get<PlayerDto>(url)
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  getFanById( id: number): Observable<FanDto | null> {
    const url = `${this.serverUrl}/fan/${id}`
    return this.http.get<FanDto>(url)
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  getScoresForFan( id: number): Observable<BriefPlayerResultDto[] | null> {
    const url = `${this.serverUrl}/fan/get-stats/${id}`
    return this.http.get<BriefPlayerResultDto[]>(url)
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, []))
      );
  }

  addFavourite(favourite: AddFavouriteDto): Observable<null> {
    const url = `${this.serverUrl}/favourite/add/`;
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

  deleteFavourite(favourite: FavouriteDto): Observable<null> {
    const url = `${this.serverUrl}/favourite/delete/${favourite.fanId}/${favourite.playerId}`
    return this.http.delete<any>(url)
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */

  /*
   * This generic handler was copied from the Angular tutorial.
   * And as a note to future, even thicker, self who will be going WTF?...
   * We use it to handle errors for all our http calls.  But all
   * our HTTP Calls return different types!  And the error handler
   * has to return the right type.  So, the error handler is
   * parameterized such that you can tell it what to return when
   * it is finished doing it's business.
   */

  private handleErrorAndShowSnackbar<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T | null> => {
      // if (401 === error.status && this.authService.isAuthenticated) {
      //   this.message.open('Your session has ended unexpectedly',
      //     null, {duration: this.appState.confirmMessageDuration});
      //   this.authService.onLogout();
      //   this.router.navigateByUrl('/login').then();
      // } else {
      this.message.open(`${error.error.message} || ${error.status}`,
          'Dismiss', {duration: 5000});
      // }
      // Let the app keep running by returning what we were told to.
      return of(result as T);
    };
  }
}

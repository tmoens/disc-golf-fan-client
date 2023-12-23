import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {FanDto} from './DTOs/fan-dto';
import {PlayerDto} from './DTOs/player-dto';
import {AddFavouriteDto} from './DTOs/add-favourite-dto';
import {FavouriteDto} from './DTOs/favourite-dto';
import {BriefPlayerResultDto} from './DTOs/brief-player-result-dto';
import {AuthService} from './auth/auth.service';
import {PlayerResultDto} from './DTOs/player-result-dto';
import {UpcomingEventsDto} from './DTOs/upcoming-events.dto';
import {ReorderFavouriteDto} from './DTOs/reorder-favourite.dto';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  serverUrl: string;

  constructor(
    private http: HttpClient,
    private message: MatSnackBar,
    private authService: AuthService,
  ) {

    if (environment.production) {
      this.serverUrl = location.origin + '/dg-fan-server';
    } else {
      this.serverUrl = 'http://localhost:3000';
    }
  }

  getPlayerById( id: string): Observable<PlayerDto | null> {
    const url = `${this.serverUrl}/player/${id}`
    return this.http.get<PlayerDto>(url, { headers: this.authService.createAccessHeader() })
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  getFanById( id: string): Observable<FanDto | null> {
    const url = `${this.serverUrl}/fan/${id}`
    return this.http.get<FanDto>(url, { headers: this.authService.createAccessHeader() })
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  getScoresForFan( id: string): Observable<BriefPlayerResultDto[] | null> {
    const url = `${this.serverUrl}/fan/get-scores/${id}`
    return this.http.get<BriefPlayerResultDto[]>(url, { headers: this.authService.createAccessHeader() })
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, []))
      );
  }

  getScoreline( id: number): Observable<PlayerResultDto | null> {
    const url = `${this.serverUrl}/scoreline/get-scoreline-detail/${id}`
    return this.http.get<any>(url, { headers: this.authService.createAccessHeader() })
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  getUpcomingEvents(): Observable<UpcomingEventsDto[] | null> {
    const url = `${this.serverUrl}/favourite/get-upcoming-events/${this.authService.getAuthenticatedUserId()}`;
    return this.http.get<any>(url,{ headers: this.authService.createAccessHeader() })
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, []))
      );
  }

  addFavourite(favourite: AddFavouriteDto): Observable<null> {
    const url = `${this.serverUrl}/add-favourite/`;
    return this.http.post<any>(url, favourite,{ headers: this.authService.createAccessHeader() })
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  updateFavourite(favourite: FavouriteDto): Observable<FavouriteDto | null> {
    const url = `${this.serverUrl}/favourite/update/`;
    return this.http.post<any>(url, favourite, { headers: this.authService.createAccessHeader() })
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }
  moveFavouriteBefore(reorderFavouriteDto: ReorderFavouriteDto): Observable<FanDto | null> {
    const url = `${this.serverUrl}/fan/move-before`;
    return this.http.post<any>(url, reorderFavouriteDto, { headers: this.authService.createAccessHeader() })
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  moveFavouriteAfter(reorderFavouriteDto: ReorderFavouriteDto): Observable<FanDto | null> {
    const url = `${this.serverUrl}/fan/move-after`;
    return this.http.post<any>(url, reorderFavouriteDto, { headers: this.authService.createAccessHeader() })
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  deleteFavourite(favourite: FavouriteDto): Observable<null> {
    const url = `${this.serverUrl}/favourite/delete/${favourite.fanId}/${favourite.playerId}`
    return this.http.delete<any>(url, { headers: this.authService.createAccessHeader() })
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  // =============================== Admin type things =========================
  getTournamentRosterChanges(): Observable<any> {
    const url = `${this.serverUrl}/round/tournament-roster-changes`
    return this.http.get<any>(url, { headers: this.authService.createAccessHeader() })
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  getPdgaApiRequestQueueStatus(): Observable<any> {
    const url = `${this.serverUrl}/pdga-api/request-queue`
    return this.http.get<any>(url, { headers: this.authService.createAccessHeader() })
      .pipe(
        catchError(this.handleErrorAndShowSnackbar(url, null))
      );
  }

  // get cron job status
  getCronJobStatus(): Observable<any> {
      const url = `${this.serverUrl}/cron-status`;
      return this.http.get<any>(url, { headers: this.authService.createAccessHeader() })
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

  private handleErrorAndShowSnackbar<T>(_operation = 'operation', resultOnError?: T) {
    return (error: any): Observable<T | null> => {
      this.message.open(`${error.error.message} || ${error.status}`,
          'Dismiss', {duration: 5000});
      // }
      // Let the app keep running by returning what we were told to.
      return of(resultOnError as T);
    };
  }
}

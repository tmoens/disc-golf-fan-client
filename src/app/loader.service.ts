import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {Router} from '@angular/router';
import {FanDto} from './DTOs/fan-dto';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  serverURL: string;

  constructor(
    private http: HttpClient,
    private message: MatSnackBar,
    private router: Router,
  ) {
    if (environment.production) {
      this.serverURL = location.origin + '/zf-server';
    } else {
      this.serverURL = 'http://localhost:3000';
    }
  }

  getFanById( id: number): Observable<FanDto | null> {
    const url = `${this.serverURL}/fan/${id}`
    return this.http.get<FanDto>(url)
      .pipe(
        catchError(this.handleError(url, null))
      );
  }

  deleteFavouriteById( fanId: number, playerId: string): Observable<null> {
    const url = `${this.serverURL}/favourite/${fanId}/${playerId}`
    return this.http.delete<any>(url)
      .pipe(
        catchError(this.handleError(url, null))
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
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T | null> => {
      // if (401 === error.status && this.authService.isAuthenticated) {
      //   this.message.open('Your session has ended unexpectedly',
      //     null, {duration: this.appState.confirmMessageDuration});
      //   this.authService.onLogout();
      //   this.router.navigateByUrl('/login').then();
      // } else {
        this.message.open(operation + '. ' + error.error.message || error.status,
          'Dismiss', {duration: 3000});
      // }
      // Let the app keep running by returning what we were told to.
      return of(result as T);
    };
  }
}

// this assumes that the params are scalar. Which they are.
export function convertObjectToHTTPQueryParams(params: any) {
  const paramArray: string[] = [];
  Object.keys(params).forEach(key => {
    if (params[key]) {
      paramArray.push(key + '=' + params[key]);
    }
  });
  if (paramArray.length > 0) {
    return '?' + paramArray.join('&');
  }  else {
    return '';
  }
}

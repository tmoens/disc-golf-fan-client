import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Router } from '@angular/router';
import { DGF_TOOL_ROUTES } from '../tools/dgf-tool-routes';
import {AuthService} from './auth.service';
import { BehaviorSubject, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// The purpose of this is to refresh the user's access token using their
// refresh token.  For the life of me, I do not understand what security this
// truly adds, but ok, it's the way I've seen it recommended millions of times.

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {

  private refreshInProgress = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.authService.accessToken;
    const authReq = token
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;

    return next.handle(authReq).pipe(
      catchError(error => {
        // Check if it is a 401 error and not a refresh token request
        if (error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !this.isRefreshTokenRequest(request)) {

          return this.handle401Error(request, next);
        }

        // Forward other errors
        return throwError(() => error);
      })
    );
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

    if (!this.refreshInProgress) {
      this.refreshInProgress = true;
      this.refreshSubject.next(null);

      return this.authService.refreshAccessToken().pipe(
        tap(newToken => {
          this.refreshInProgress = false;
          this.refreshSubject.next(newToken);
        }),
        switchMap(newToken => {
          const retryReq = request.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          });
          return next.handle(retryReq);
        }),
        catchError(err => {
          this.refreshInProgress = false;
          this.authService.logout();
          this.router.navigate([DGF_TOOL_ROUTES.LOGIN]);
          return throwError(() => err);
        })
      );
    }

    // If refresh is already in progress, wait for it
    return this.refreshSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        const retryReq = request.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next.handle(retryReq);
      })
    );
  }

  private isRefreshTokenRequest(request: HttpRequest<any>): boolean {
    // Define how to identify the refresh token request, e.g., by URL
    return request.url.includes('/auth/refresh-access-token');  // Adjust the URL to your refresh token endpoint
  }
}

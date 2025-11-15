import {Injectable, Injector} from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AppTools } from '../shared/app-tools';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {Observable, switchMap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

// The purpose of this is to refresh the user's access token using their
// refresh token.  For the life of me, I do not understand what security this
// truly adds, but ok it's the way I've seen recommended a million times.

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private injector: Injector,
    private router: Router  // Inject the Router for redirection
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        // Check if it is a 401 error and not a refresh token request
        if (error instanceof HttpErrorResponse && error.status === 401 && !this.isRefreshTokenRequest(request)) {
          return this.handle401Error(request, next);
        }
        // Forward other errors
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Call the refresh token service
    return this.authService.refreshAccessToken().pipe(
      switchMap((_token: any) => {
        // Set the new token in the header and retry the original request
        const authReq = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${this.authService.accessToken}`)
        });
        return next.handle(authReq);
      }),
      catchError((err) => {
        // If refreshing fails (e.g., refresh token is also expired), redirect to login
        void this.router.navigate([`/${AppTools.LOGIN.route}`]);
        return throwError(() => err);
      })
    );
  }

  private isRefreshTokenRequest(request: HttpRequest<any>): boolean {
    // Define how to identify the refresh token request, e.g., by URL
    return request.url.includes('/auth/refresh-access-token');  // Adjust the URL to your refresh token endpoint
  }
}

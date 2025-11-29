import {Injectable, signal} from '@angular/core';
import {map, Observable, of, throwError} from 'rxjs';
import { HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { LoaderService } from '../loader.service';
import { AccessTokenPayload } from './dtos/access-token-payload';
import {catchError} from 'rxjs/operators';
import {LoginDto} from './dtos/login-dto';
import {RefreshAccessTokenResponseDto} from './dtos/refresh-access-token-response-dto';
import {AuthenticatedUser} from './authenticatedUser';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  serverUrl: string;
  // this is where the user was trying to navigate to when they were redirected to log in.
  intendedPath: string = '';

  authenticatedUser = signal<AuthenticatedUser | null>(null);

  private _refreshToken: string = '';
  get refreshToken(): string {
    return this._refreshToken;
  }

  set refreshToken(token: string) {
    if (!token || this.isTokenExpired(token)) {
      token = '';
    }
    localStorage.setItem('refreshToken', token);
    this._refreshToken = token;
  }

  private _accessToken: string = '';
  get accessToken(): string {
    return this._accessToken;
  }

  set accessToken(token: string) {
    if (!token || this.isTokenExpired(token)) {
      this._accessToken = '';
      localStorage.setItem('accessToken', '');
      this.authenticatedUser.set(null);
      return;
    }

    this._accessToken = token;
    const tokenPayload: AccessTokenPayload = this.decryptToken(token);
    if (!tokenPayload || !tokenPayload.sub || !tokenPayload.role) {
      console.error('Failed to decode access token payload.');
      return;
    }

    // When you get a new access token, it is time to update the authenticatedUser
    // using that token's payload.
    localStorage.setItem('accessToken', token);
    this.authenticatedUser.set(new AuthenticatedUser(
      tokenPayload.sub,
      tokenPayload.role,
      tokenPayload.email,
      tokenPayload.emailConfirmed,
    ));
  }

  constructor(
    private loader: LoaderService,
  ) {
    // reload access tokens after browser refresh or re-open of application
    const storedAccessToken: string | null = (localStorage.getItem('accessToken'));
    if (storedAccessToken) this.accessToken = storedAccessToken;

    const storedRefreshToken: string | null = (localStorage.getItem('refreshToken'));
    if (storedRefreshToken) this.refreshToken = storedRefreshToken;

    if (environment.production) {
      this.serverUrl = `${location.origin}/dg-fan-server`;
    } else {
      this.serverUrl = environment.apiBaseUrl;
    }
  }

  public isAuthenticated(): boolean {
    return !!this.authenticatedUser();
  }

  login(loginDto: LoginDto): Observable<void> {
    return this.loader.login(loginDto).pipe(
      map((resp) => {
        // resp === null means: non-400 error already snack-barred
        // Treat as login failure, but do not throw.
        if (!resp) return;

        // Login success
        this.accessToken = resp.accessToken;
        this.refreshToken = resp.refreshToken;
      }),
      catchError(err => {
        // err is a string thrown by handleErrorsButThrowOn400()
        return throwError(() => err);
      })
    );
  }
  logout(): Observable<void | null> {
    return this.loader.logout().pipe(
      map(() => {
        this.accessToken = '';
        this.refreshToken = '';
        this.authenticatedUser.set(null);
      })
    );
  }


  // -----------------------------------
  // REFRESH ACCESS TOKEN
  // Used by the UnauthorizedInterceptor
  // MUST RETURN ONLY the accessToken string
  // -----------------------------------
  refreshAccessToken(): Observable<string> {
    if (!this.isAuthenticated()) return of('');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.refreshToken}`);
    return this.loader.refreshAccessToken(headers).pipe(
      map((resp: RefreshAccessTokenResponseDto | null) => {
        if (!resp) return '';

        this.accessToken = resp.accessToken;
        return resp.accessToken;
      }),
      catchError(error => {
        console.error('Error refreshing access token:', error);
        this.refreshToken = '';
        return throwError(() => error);
      })
    );
  }

  // find out if the token will expire within the next however many seconds.
  isTokenExpired(token: string, withinSeconds: number = 0): boolean {
    const tokenPayload: any | null = this.decryptToken(token);
    if (tokenPayload && tokenPayload.exp) {
      const d = new Date(0);
      d.setUTCSeconds(tokenPayload.exp);
      return d.valueOf() <= new Date().valueOf() + withinSeconds * 1000;
    } else {
      // no token or no token expiry - deemed expired
      return true;
    }
  }

  // this decodes the access token and stuffs the token's payload in a typed object.
  decryptToken(token: string): any | null {
    if (token) {
      return JSON.parse(atob(token.split('.')[1]));
    } else {
      return null;
    }
  }

  authenticatedUserCanPerformRole(roleInQuestion?: string): boolean {
    if (!roleInQuestion) return true;
    const user = this.authenticatedUser();
    if (!user) {
      return false;
    } else {
      return user.canPerformRole(roleInQuestion);
    }
  }
}

import {Injectable, signal} from '@angular/core';
import {map, Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { AccessTokenPayload } from './dtos/access-token-payload';
import {RegistrationDto} from './dtos/registration-dto';
import {catchError} from 'rxjs/operators';
import {LoginDto} from './dtos/login-dto';
import {LoginResponseDto} from './dtos/login-response-dto';
import {RefreshAccessTokenResponseDto} from './dtos/refresh-access-token-response-dto';
import {ForgotPasswordDto} from './dtos/forgot-password-dto';
import {ResetPasswordDto} from './dtos/reset-password-dto';
import {RefreshTokenPayload} from './dtos/refresh-token-payload';
import {User} from './user';
import {UserRoleService} from './dgf-roles';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  // Signal to track the authenticated user ID
  authenticatedUser = signal<User | null>(null);

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
      console.log(`setting expired or empty accessToken to: ${JSON.stringify(token)}`);
      this._accessToken = '';
      localStorage.setItem('accessToken', '');
      this.authenticatedUser.set(null);
    } else {
      console.log(`setting refreshed accessToken to: ${JSON.stringify(token)}`);
      this._accessToken = token;
      const tokenPayload: AccessTokenPayload = this.decryptToken(token);
      if (!tokenPayload || !tokenPayload.sub || !tokenPayload.role) {
        console.error('Failed to decode access token payload.');
        return;
      }
      localStorage.setItem('accessToken', token);
      this.authenticatedUser.set(new User(tokenPayload.sub, tokenPayload.role, tokenPayload.email));
    }
  }

  // this is where the user was trying to navigate to when they were forced to log in.
  intendedPath: string = '';

  serverUrl: string;

  constructor(
    private http: HttpClient,
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

  // Processing a login.  A normal case is to update the local state and be done.
  // If there was an HTTP Error, we normalize a nice message and rethrow a string for the component to show.
  login(loginDto: LoginDto): Observable<void> {
    return this.http.post<LoginResponseDto>(`${this.serverUrl}/auth/login`, loginDto).pipe(
      map((loginResponse: LoginResponseDto) => {
        this.accessToken = loginResponse.accessToken;
        this.refreshToken = loginResponse.refreshToken;
        return; // void
      }),
      catchError(err => {
        const message = this.extractErrorMessage(err, 'Sign-in failed. Please try again.');
        return throwError(() => message);
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    return this.http.get<any>(
      `${this.serverUrl}/auth/logout`,
      {headers: this.createAccessHeader()}).pipe(
      map(() => {
        this.accessToken = '';
        this.refreshToken = '';
        this.authenticatedUser.set(null);
      }),
    );
  }

  // refresh is used in the verb sense here.
  // We are refreshing the accessToken using the refreshToken (refresh is a noun in refreshToken)
  refreshAccessToken(): Observable<any> {
    // cannot refresh the access token if not authenticated.
    if (!this.isAuthenticated()) {
      return of(null);
    }

    return this.http.get<any>(
      `${this.serverUrl}/auth/refresh-access-token`,
      {headers: this.createRefreshHeader()}).pipe(
      map((response: RefreshAccessTokenResponseDto) => {
        this.accessToken = response.accessToken;
      }),
      catchError(error => {
        console.error('Error occurred while refreshing access token:', error);
        this.refreshToken = '';
        return throwError(() => error);
      })
    );
  }

  register(dto: RegistrationDto): Observable<string | null> {
    const url = `${this.serverUrl}/auth/register/`;
    return this.http.post<null>(url, dto)
      .pipe(
        catchError(this.handleError())
      );
  }

  forgotPassword(dto: ForgotPasswordDto): Observable<string | null> {
    const url = `${this.serverUrl}/auth/forgot-password/`;
    return this.http.put<null>(url, dto)
      .pipe(
        catchError(this.handleError())
      );
  }

  resetPassword(dto: ResetPasswordDto): Observable<string | null> {
    const url = `${this.serverUrl}/auth/reset-password/`;
    return this.http.put<null>(url, dto)
      .pipe(
        catchError(this.handleError())
      );
  }

  confirmEmail(token: string): Observable<string | null> {
    const url = `${this.serverUrl}/auth/confirm-email/${token}`;
    return this.http.get<string>(url)
      .pipe(
        catchError(this.handleError())
      );
  }

  createAccessHeader() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
  }

  createRefreshHeader() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.refreshToken}`);
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

  // this decodes the access token and stuffs the token's payload in typed object.
  decryptToken(token: string): any | null {
    if (token) {
      return JSON.parse(atob(token.split('.')[1]));
    } else {
      return null;
    }
  }

  authenticatedUserCanPerformRole(roleInQuestion?: string): boolean {
    if (!roleInQuestion) return true;
    if (!(this.isAuthenticated())) {
      return false;
    }
    return UserRoleService.isAuthorized(this.decryptToken(this.refreshToken).role, roleInQuestion);
  }

  private handleError() {
    return (error: any): Observable<string> => {
      return of(this.extractErrorMessage(error, 'Request failed. Please try again.'));
    };
  }

  /**
   * Extracts a human-friendly message from various HttpErrorResponse shapes.
   * Falls back to a sensible default if nothing useful is present.
   */
  private extractErrorMessage(error: any, fallback: string): string {
    // Common server shapes: { error: { message } }, { message }, plain string
    const msg =
      error?.error?.message ??
      error?.message ??
      (typeof error === 'string' ? error : null);

    // If message is an array, join with newlines
    if (Array.isArray(msg)) {
      return msg.join('\n');
    }

    // Optionally surface specific status codes
    if (!msg && error?.status) {
      if (error.status === 0) return 'Cannot reach server. Check your network and try again.';
      if (error.status >= 500) return 'The server encountered a problem. Please try again later.';
      if (error.status === 401) return 'Invalid email or password.';
    }

    return msg || fallback;
  }
}

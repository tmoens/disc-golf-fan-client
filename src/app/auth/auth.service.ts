import {Injectable} from '@angular/core';
import {Observable, map, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {RegistrationDto} from './auth-related-dtos/registration-dto';
import {catchError} from 'rxjs/operators';
import {LoginDto} from './auth-related-dtos/login-dto';
import {LoginResponseDto} from './auth-related-dtos/login-response-dto';
import {RefreshAccessTokenResponseDto} from './auth-related-dtos/refresh-access-token-response-dto';
import {ForgotPasswordDto} from './auth-related-dtos/forgot-password-dto';
import {ResetPasswordDto} from './auth-related-dtos/reset-password-dto';
import {UserRoles} from './auth-related-dtos/roles';
import {RefreshTokenPayload} from './auth-related-dtos/refresh-token-payload';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _refreshToken: string = '';
  get refreshToken(): string {
    return this._refreshToken;
  }

  set refreshToken(token: string) {
    if (!token || this.isTokenExpired(token)) {
      token = ''
    }
    localStorage.setItem('refreshToken', token);
    this._refreshToken = token;
  }

  private _accessToken: string = ''
  get accessToken(): string {
    return this._accessToken;
  }

  set accessToken(token: string) {
    if (!token || this.isTokenExpired(token)) {
      token = ''
    }
    localStorage.setItem('accessToken', token);
    this._accessToken = token;
  }


  // this is where the user was trying to navigate to when they were forced to log in.
  intendedPath: string = '';

  serverUrl: string;

  constructor(
    private http: HttpClient,
    ) {
    // reload access tokens after browser refresh or re-open of application
    const storedAccessToken: string | null = (localStorage.getItem('accessToken'));
    if (storedAccessToken) this.accessToken = storedAccessToken

    const storedRefreshToken: string | null = (localStorage.getItem('refreshToken'));
    if (storedRefreshToken) this.refreshToken = storedRefreshToken;

    if (environment.production) {
      this.serverUrl = location.origin + '/dg-fan-server';
    } else {
      this.serverUrl = 'http://localhost:3000';
    }
  }

  // As long as there is a valid refresh token, we are deemed authenticated
  public isAuthenticated(): boolean {
    return !!this.refreshToken;
  }

  getAuthenticatedUserId(): string | null {
    const tokenPayload: RefreshTokenPayload | null = this.decryptToken(this.refreshToken);
    if (tokenPayload && tokenPayload.id) {
      return tokenPayload.id;
    } else {
      return null;
    }
  }

  // Processing a login.  Normal case is to update local state and be done.
  // If there was an HTTP Error, we try to make a nice message and throw an error.
  login(loginDto: LoginDto): Observable<any> {
    return this.http.post<any>(`${this.serverUrl}/auth/login`, loginDto).pipe(
      map((loginResponse: LoginResponseDto) => {
        this.accessToken = loginResponse.accessToken;
        this.refreshToken = loginResponse.refreshToken;
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    return this.http.get<any>(
      `${this.serverUrl}/auth/logout`,
      { headers: this.createAccessHeader() }).pipe(
      map(() => {
        this.accessToken = '';
        this.refreshToken = '';
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
      { headers: this.createRefreshHeader() }).pipe(
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

  register( dto: RegistrationDto): Observable<string | null> {
    const url = `${this.serverUrl}/auth/register/`
    return this.http.post<null>(url, dto)
      .pipe(
        catchError(this.handleError())
      );
  }

  forgotPassword( dto: ForgotPasswordDto): Observable<string | null> {
    const url = `${this.serverUrl}/auth/forgot-password/`
    return this.http.put<null>(url, dto)
      .pipe(
        catchError(this.handleError())
      );
  }

  resetPassword( dto: ResetPasswordDto): Observable<string | null> {
    const url = `${this.serverUrl}/auth/reset-password/`
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
    return new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`)
  }

  createRefreshHeader() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.refreshToken}`)
  }

  // find out if the token will expire within the next 65 seconds.
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
    return UserRoles.isAuthorized(this.decryptToken(this.refreshToken).role, roleInQuestion);
  }

  private handleError() {
    return (error: any): Observable<string> => {
      return of(error.error.message);
    };
  }
}

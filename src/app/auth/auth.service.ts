import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, map, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {RegistrationDto} from './auth-related-dtos/registration-dto';
import {catchError} from 'rxjs/operators';
import {LoginDto} from './auth-related-dtos/login-dto';
import {LoginResponseDto} from './auth-related-dtos/login-response-dto';
import {RefreshAccessTokenResponseDto} from './auth-related-dtos/refresh-access-token-response-dto';
import {ForgotPasswordDto} from './auth-related-dtos/forgot-password-dto';
import {ResetPasswordDto} from './auth-related-dtos/reset-password-dto';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly _authenticatedUserIdSubject: BehaviorSubject<string | null>;
  private accessTokenSubject: BehaviorSubject<string | null>;
  private readonly refreshTokenSubject: BehaviorSubject<string | null>;
  serverUrl: string;

  constructor(private http: HttpClient) {
    this._authenticatedUserIdSubject = new BehaviorSubject<string | null>(null);

    this.accessTokenSubject = new BehaviorSubject<string | null>(null);
    const storedAccessToken: string | null = (localStorage.getItem('accessToken'));
    if (storedAccessToken) this.setAccessToken(storedAccessToken);

    this.refreshTokenSubject = new BehaviorSubject<string | null>(null);
    const storedRefreshToken: string | null = (localStorage.getItem('refreshToken'));
    if (storedRefreshToken) this.setRefreshToken(storedRefreshToken);

    if (environment.production) {
      this.serverUrl = location.origin + '/dg-fan-server';
    } else {
      this.serverUrl = 'http://localhost:3000';
    }
  }

  public get currentAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  public get currentRefreshToken(): string | null {
    return this.refreshTokenSubject.value;
  }

  public get authenticatedUserIdSubject() {
    return this._authenticatedUserIdSubject;
  }

  public setAccessToken(token: string) {
    if (!token || this.isTokenExpired(token)) {
      this.removeAccessToken();
    } else {
      localStorage.setItem('accessToken', token);
      this.accessTokenSubject.next(token);
    }
  }

  public setRefreshToken(token: string) {
    if (!token || this.isTokenExpired(token, 60)) {
      this.removeRefreshToken();
    } else {
      localStorage.setItem('refreshToken', token);
      this.refreshTokenSubject.next(token);
      this._authenticatedUserIdSubject.next(this.decryptToken(token).id);
    }
  }

  // As long as there is a valid refresh token, we are deemed authenticated
  public isAuthenticated() {
    return !!this.currentRefreshToken;
  }

  public removeAccessToken() {
    localStorage.removeItem('accessToken');
    this.accessTokenSubject.next(null);
  }

  public removeRefreshToken() {
    localStorage.removeItem('refreshToken');
    this.refreshTokenSubject.next(null);
  }

  // Processing a login.  Normal case is to update local state and be done.
  // If there was an HTTP Error, we try to make a nice message and throw an error.
  login(loginDto: LoginDto): Observable<any> {
    return this.http.post<any>(`${this.serverUrl}/auth/login`, loginDto).pipe(
      map((loginResponse: LoginResponseDto) => {
        this.setAccessToken(loginResponse.accessToken);
        this.setRefreshToken(loginResponse.refreshToken);
      })
    );
  }

  refreshAccessToken(): Observable<any> {
    return this.http.get<any>(
      `${this.serverUrl}/auth/refresh-access-token`,
      { headers: this.createRefreshHeader() }).pipe(
      map((response: RefreshAccessTokenResponseDto) => {
        this.setAccessToken(response.accessToken);
      }),
      catchError(error => {
        console.error('Error occurred while refreshing access token:', error);
        this.removeRefreshToken(); // Call removeRefreshToken on error
        return throwError(() => error); // Re-throw the error for further handling if necessary
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    this.removeAccessToken();
    this.removeRefreshToken();
    return this.http.get<any>(
      `${this.serverUrl}/auth/logout`,
      { headers: this.createAccessHeader() }).pipe(
        map(() => {
          // nothing really to do here
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
    return new HttpHeaders().set('Authorization', `Bearer ${this.currentAccessToken}`)
  }

  createRefreshHeader() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.currentRefreshToken}`)
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

  private handleError() {
    return (error: any): Observable<string> => {
      return of(error.error.message);
    };
  }
}

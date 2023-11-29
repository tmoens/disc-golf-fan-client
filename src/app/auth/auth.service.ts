import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, map, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {RegistrationDto} from '../DTOs/auth-related/registration-dto';
import {catchError} from 'rxjs/operators';
import {LoginDto} from '../DTOs/auth-related/login-dto';
import {LoginResponseDto} from '../DTOs/auth-related/login-response-dto';
import {RefreshAccessTokenResponseDto} from '../DTOs/auth-related/refresh-access-token-response-dto';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private accessTokenSubject: BehaviorSubject<string | null>;
  private refreshTokenSubject: BehaviorSubject<string | null>;
  serverUrl: string;

  constructor(private http: HttpClient) {
    this.accessTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('accessToken'));
    this.refreshTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('refreshToken'));
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

  public setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
    this.accessTokenSubject.next(token);
  }

  public setRefreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
    this.refreshTokenSubject.next(token);
  }

  public removeAccessToken() {
    localStorage.removeItem('accessToken');
    this.accessTokenSubject.next(null);
  }

  public removeRefreshToken() {
    localStorage.removeItem('refreshToken');
    this.accessTokenSubject.next(null);
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
    })
  );
  }

  logout() {
    // remove user from local storage to log user out
    return this.http.post<any>(
      `${this.serverUrl}/auth/logout`,
      null,
      { headers: this.createAccessHeader()
      })
      .pipe(map(() => {
          // TODO store user details from the JWT?
          this.removeAccessToken();
          this.removeRefreshToken();
        })
      );
  }

  passwordReset(email: string): Observable<any> {
    // API call for password reset
    return this.http.post(`${this.serverUrl}/auth/password-reset`, { email });
  }

  register( registrationDto: RegistrationDto): Observable<string | null> {
    const url = `${this.serverUrl}/auth/register/`
    return this.http.post<null>(url, registrationDto)
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

  private handleError() {
    return (error: any): Observable<string> => {
      return of(error.error.message);
    };
  }

  createAccessHeader() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.currentAccessToken}`)
  }

  createRefreshHeader() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.currentRefreshToken}`)
  }
}

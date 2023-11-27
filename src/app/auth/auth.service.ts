import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, map, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {RegistrationDto} from '../DTOs/auth-related/registration-dto';
import {catchError} from 'rxjs/operators';
import {LoginDto} from '../DTOs/auth-related/login-dto';
import {LoginResponseDto} from '../DTOs/auth-related/login-response-dto';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private currentTokenSubject: BehaviorSubject<string | null>;
  public currentToken: Observable<string | null>;
  serverUrl: string;

  constructor(private http: HttpClient) {
    this.currentTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('accessToken'));
    this.currentToken = this.currentTokenSubject.asObservable();
    if (environment.production) {
      this.serverUrl = location.origin + '/dg-fan-server';
    } else {
      this.serverUrl = 'http://localhost:3000';
    }
  }

  public get currentTokenValue(): string | null {
    return this.currentTokenSubject.value;
  }

  login(loginDto: LoginDto): Observable<LoginResponseDto> {

    return this.http.post<any>(`${this.serverUrl}/auth/login`, loginDto)
      .pipe(map(loginResponse => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('accessToken', loginResponse.accessToken);
        localStorage.setItem('refreshToken', loginResponse.refreshToken);
        this.currentTokenSubject.next(loginResponse.accessToken);
        return loginResponse;
      }));
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>('/api/auth/refresh', { token: localStorage.getItem('refreshToken') })
      .pipe(map(user => {
        localStorage.setItem('accessToken', user.accessToken);
        this.currentTokenSubject.next(user.accessToken);
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentTokenSubject.next(null);
  }

  passwordReset(email: string): Observable<any> {
    // API call for password reset
    return this.http.post('/api/auth/password-reset', { email });
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

}

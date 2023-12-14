import {Injectable, signal, WritableSignal} from '@angular/core';
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

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  authenticatedUserIdSig: WritableSignal<string> = signal<string>('');
  accessTokenSig: WritableSignal<string> = signal<string>('');
  refreshTokenSig: WritableSignal<string> = signal<string>('');
  serverUrl: string;

  constructor(
    private http: HttpClient,
    ) {

    const storedAccessToken: string | null = (localStorage.getItem('accessToken'));
    if (storedAccessToken) this.setAccessToken(storedAccessToken);

    const storedRefreshToken: string | null = (localStorage.getItem('refreshToken'));
    if (storedRefreshToken) this.setRefreshToken(storedRefreshToken);

    if (environment.production) {
      this.serverUrl = location.origin + '/dg-fan-server';
    } else {
      this.serverUrl = 'http://localhost:3000';
    }
  }

  public setAccessToken(token: string) {
    if (!token || this.isTokenExpired(token)) {
      this.removeAccessToken();
    } else {
      localStorage.setItem('accessToken', token);
      this.accessTokenSig.set(token);
    }
  }

  public async setRefreshToken(token: string) {
    if (!token || this.isTokenExpired(token, 60)) {
      this.removeRefreshToken();
    } else {
      localStorage.setItem('refreshToken', token);
      this.refreshTokenSig.set(token);
      const fanId = this.decryptToken(token).id
      this.authenticatedUserIdSig.set(fanId);
    }
  }

  // As long as there is a valid refresh token, we are deemed authenticated
  public isAuthenticated() {
    return !!this.refreshTokenSig();
  }

  public removeAccessToken() {
    localStorage.removeItem('accessToken');
    this.accessTokenSig.set('');
  }

  public removeRefreshToken() {
    localStorage.removeItem('refreshToken');
    this.refreshTokenSig.set('');
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

  logout() {
    // remove user from local storage to log user out
    return this.http.get<any>(
      `${this.serverUrl}/auth/logout`,
      { headers: this.createAccessHeader() }).pipe(
      map(() => {
        this.removeAccessToken();
        this.removeRefreshToken();
      }),
    );
  }

  // refresh is used in the verb sense here.
  // We are refreshing the accessToken using the (noun sense) refreshToken
  refreshAccessToken(): Observable<any> {
    if (!this.isAuthenticated()) {
      return of(null);
    }
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
    return new HttpHeaders().set('Authorization', `Bearer ${this.accessTokenSig()}`)
  }

  createRefreshHeader() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.refreshTokenSig()}`)
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

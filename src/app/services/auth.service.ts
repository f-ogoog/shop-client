import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { RegisterUser } from '../models/client.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/auth/`;

  private user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  user$ = this.user.asObservable();

  login(email: string, password: string): Observable<{ user: User | null }> {
    return this.http
      .post<{ message: string }>(
        `${this.authUrl}login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        switchMap(() => this.getUser()),
        tap(({ user }) => {
          this.user.next(user);
        })
      );
  }

  registration(userData: RegisterUser): Observable<{ user: User | null }> {
    return this.http
      .post<{ message: string }>(`${this.authUrl}register`, userData, {
        withCredentials: true,
      })
      .pipe(
        switchMap(() => this.getUser()),
        tap(({ user }) => {
          this.user.next(user);
        })
      );
  }

  logout(): void {
    this.http
      .post(`${this.authUrl}logout`, {}, { withCredentials: true })
      .subscribe(() => {
        localStorage.clear();
        this.user.next(null);
        window.location.reload();
      });
  }

  getUser(): Observable<{ user: User | null }> {
    return this.http
      .get<{ user: User }>(`${this.authUrl}me`, { withCredentials: true })
      .pipe(
        tap(
          ({ user }) => {
            this.user.next(user);
          },
          catchError(() => {
            this.user.next(null);
            return of({ user: null });
          })
        )
      );
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://127.0.0.1:8000/';

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  getUsers(): Observable<User[]> {
    const url = `${this.baseUrl}user/admin_users_list`;
    return this.http.get<User[]>(url);
  }

  getUser(phone_number:string):Observable<User>{
    const url = `${this.baseUrl}user/client/${phone_number}/`;
    return this.http.get<User>(url);
  }
  deleteUser(phone_number:string):Observable<User>{
    const url = `${this.baseUrl}user/client/${phone_number}/`;
    return this.http.delete<User>(url);
  }

  login(phoneNumber: string, password: string): Observable<User> {
    const url = `${this.baseUrl}user/login/`;
    return this.http.post<User>(url, { phone_number: phoneNumber, password }, { withCredentials: true }).pipe(
      tap((user: User) => {
        this.currentUserSubject.next(user);
      }),
      // catchError(this.handleError<User>('login'))
    );
  }


  logout(): Observable<any> {
    const url = `${this.baseUrl}user/logout/`;
    return this.http.post<any>(url, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      }),
      // catchError(this.handleError('logout'))
    );
  }

  refreshToken(): Observable<any> {
    const url = `${this.baseUrl}user/token/refresh/`;
    return this.http.post<any>(url, {}, { withCredentials: true }).pipe(
      catchError(this.handleError('refreshToken'))
    );
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }


   // Nouvelle méthode pour initier l'inscription et demander le code OTP
   register(NomComplet: string,phoneNumber: string, password: string): Observable<any> {
    const url = `${this.baseUrl}user/register/`;
    return this.http.post<any>(url, { nom_complet: NomComplet,phone_number: phoneNumber, password }, { withCredentials: true })
    // .pipe(
    //   catchError(this.handleError('register'))
    // );
  }

  // Nouvelle méthode pour vérifier le code OTP et finaliser l'inscription
  verifyOTP(otpCode: string): Observable<any> {
    const url = `${this.baseUrl}user/verify-otp/`;
    return this.http.post<any>(url, { otp_code: otpCode }, { withCredentials: true }).pipe(
      tap((user: User) => {
        // Si la vérification réussit, on met à jour l'utilisateur courant
        this.currentUserSubject.next(user);
      }),
      // catchError(this.handleError('verifyOTP'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://127.0.0.1:8000/user/';

  private jwtKey = 'jwt';
  loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  setToken(token: string) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.setItem(this.jwtKey, token);
  }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return localStorage.getItem(this.jwtKey);
    }
  return null}

  removeToken() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.removeItem(this.jwtKey);
  }
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}register/`, user);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}get-user/`, { withCredentials: true });
  }

  updateUser(user: Object): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}user/`, user, { withCredentials: true  });
  }

  changePassword(currentPassword : string,newPassword:string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}change_password/`, {mdp_actuel : currentPassword,nouveau_mdp:newPassword}, {withCredentials: true  });
  }

  login(phone_number: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}login/`, { phone_number, password })
      .pipe(
        tap(response => {
          if (response.jwt) {
            console.log("connecté")
            this.setToken(response.jwt);
            this.loggedIn.next(true);
          } else {
            console.log('pas de token');
          }
        })
      );
  }

  logout(): void {
    this.removeToken();
    this.loggedIn.next(false);
  }

  getUsers(): Observable<User[]> {
    const url = `${this.baseUrl}user/admin_users_list`;
    return this.http.get<User[]>(url);
  }

  getUserByphoneNumber(phone_number:string):Observable<User>{
    const url = `${this.baseUrl}user/client/${phone_number}/`;
    return this.http.get<User>(url);
  }

  

  deleteUser(phone_number:string):Observable<User>{
    const url = `${this.baseUrl}user/client/${phone_number}/`;
    return this.http.delete<User>(url);
  }


  // Nouvelle méthode pour vérifier le code OTP et finaliser l'inscription
  // verifyOTP(otpCode: string): Observable<any> {
  //   const url = `${this.baseUrl}user/verify-otp/`;
  //   return this.http.post<any>(url, { otp_code: otpCode }, { withCredentials: true }).pipe(
  //     tap((user: User) => {
  //     }),
  //     // catchError(this.handleError('verifyOTP'))
  //   );
  // }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../models/user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';



export interface Avis{
  Texte_avis:string,
  Avis_author:user
}

export interface user{
  nom_complet:string,
  phone_number:string
}
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

  register(nom_complet:string,phone_number:string,pasword:string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}register/`, {nom_complet:nom_complet,phone_number:phone_number,password:pasword});
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}get-user/`, { withCredentials: true });
  }

  updateUser(user: Object): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}client/`, user, { withCredentials: true  });
  }


  changePassword(currentPassword : string,newPassword:string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}change_password/`, {mdp_actuel : currentPassword,nouveau_mdp:newPassword}, {withCredentials: true  });
  }


  login(phone_number: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}login/`, { phone_number, password })
      .pipe(
        tap(response => {
          if (response.jwt) {
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

  // getUsers(): Observable<User[]> {
  //   const url = `${this.baseUrl}admin_users_list/`;
  //   return this.http.get<User[]>(url);
  // }
  getUsers(page: number = 1, pageSize: number = 10, searchTerm: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.http.get<User[]>(`${this.baseUrl}admin_users_list/`, { params });
  }

  getUserByphoneNumber(slug:string):Observable<User>{
    const url = `${this.baseUrl}user/${slug}/`;
    return this.http.get<User>(url);
  }

  

  deleteUser(slug:string):Observable<any>{
    const url = `${this.baseUrl}delete-user/${slug}/`;
    return this.http.delete<any>(url);
  }

  getAllAvis():Observable<Avis[]>{
    const url=`${this.baseUrl}user/avisAPI/Avis`
    return this.http.get<Avis[]>(url)
  }

  verifyOTP(otpCode: string): Observable<any> {
    const url = `${this.baseUrl}user/verify-otp/`;
    return this.http.post<any>(url, { otp_code: otpCode }, { withCredentials: true })
  }

}

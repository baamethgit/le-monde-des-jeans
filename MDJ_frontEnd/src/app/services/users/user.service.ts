import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../models/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Avis, AvisCreationData } from '../../models/Avis';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://127.0.0.1:8000/user/';

  private readonly jwtKey = 'jwt';
  
  loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private readonly http: HttpClient) { }

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

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}get-user/`, { withCredentials: true });
  }

  updateUser(user: Object): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}client/`, user, { withCredentials: true  });
  }


  changePassword(currentPassword : string,newPassword:string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}change_password/`, {mdp_actuel : currentPassword,nouveau_mdp:newPassword}, {withCredentials: true  });
  }

  sendPasswordResetOTP(addresse_mail: string): Observable<any> {
    return this.http.post(`${this.baseUrl}send-otp/`, { addresse_mail });
  }

  verifyPasswordResetOTP(addresse_mail: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}verify-reset-otp/`, { addresse_mail, otp });
  }
  
  resetPassword(addresse_mail: string, newPassWord: string): Observable<any> {
    return this.http.post(`${this.baseUrl}reset-password/`, {
      addresse_mail,newPassWord
    });
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
    const url=`${this.baseUrl}avis/`
    return this.http.get<Avis[]>(url,{ withCredentials: true })
  }

  deleteAvis(id:number):Observable<any>{
    const url=`${this.baseUrl}avis/${id}`
    return this.http.delete(url,{ withCredentials: true })
  }

  addAvis(data : AvisCreationData):Observable<AvisCreationData>{
    const url=`${this.baseUrl}avis/`
    return this.http.post<AvisCreationData>(url,data,{ withCredentials: true })
  }

   // Étape 1 : Envoyer les informations d'inscription et recevoir l'OTP
  register(signupData: { phone_number: string,addresse_mail:string, password: string, nom_complet: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}register/`, signupData);
  }

  // Étape 2 : Vérifier l'OTP et finaliser l'inscription
  verifyOTP(addresse_mail: string,otpCode: string): Observable<any> {
    return this.http.post(`${this.baseUrl}verify-otp/`, { addresse_mail: addresse_mail,otp_code: otpCode }, { withCredentials: true });
  }

}

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { User } from '../../models/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Avis, AvisCreationData } from '../../models/Avis';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // private readonly baseUrl = '/api/user/';
  private readonly baseUrl = 'http://127.0.0.1:8000/user/';
  loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router : Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }


  private hasToken(): boolean {
    return !!this.getAccessToken();
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getAccessToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  setAccessToken(token : string): void {
    if (this.isBrowser) {
      localStorage.setItem('access_token',token);
    }
  }

  removeAccessToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
    }
  }


  getRefreshToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  setRefreshToken(token : string): void {
    if (this.isBrowser) {
      localStorage.setItem('refresh_token',token);
    }
  }

  removeRefreshToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem('refresh_token');
    }
  }
  refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    return this.http.post<any>(`${this.baseUrl}token/refresh/`, { refresh }).pipe(
        tap(response => {
            this.setAccessToken(response.access);
        })
    );
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
          if (response) {
            this.setAccessToken(response.access);
            this.setRefreshToken(response.refresh);
            this.loggedIn.next(true);
          } else {
            // console.log('pas de token');
          }
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}logout/`, {})
      .pipe(
        tap(() => {
          this.removeAccessToken();this.removeRefreshToken();
          this.loggedIn.next(false);
          this.router.navigate(['login']);
        })
      );
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

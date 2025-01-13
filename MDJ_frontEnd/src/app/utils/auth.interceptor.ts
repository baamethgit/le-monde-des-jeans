import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../services/users/user.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(UserService);
  const router = inject(Router);
  const token = authService.getAccessToken();

  if(request.url.includes('login') || request.url.includes('register')){
    return next(request);
  }
  
  if (token) {
    const clonedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(clonedRequest)
    .pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse &&
          error.status === 401) 
          {
            if (!isRefreshing) {
              isRefreshing = true;
              return authService.refreshToken().pipe(
                switchMap(() => {
                  isRefreshing = false;
                  const newToken = authService.getAccessToken();
                  const newRequest = request.clone({
                    setHeaders: {
                      Authorization: `Bearer ${newToken}`
                    }
                  });
                  return next(newRequest);
                }),
                catchError(refreshError => {
                  isRefreshing = false;
                  console.log("erreur de refreshing",refreshError)

                  if (refreshError.status == '401') {
                    console.log("deconnexion")
                    authService.logout();
                  }
                  router.navigate(["login"]);
                  return throwError(() => refreshError);
                })
              );
            }
            return next(clonedRequest);
        }
        return throwError(() => error);
      })
    );
  }
  router.navigate(['login']);
  return next(request);
};



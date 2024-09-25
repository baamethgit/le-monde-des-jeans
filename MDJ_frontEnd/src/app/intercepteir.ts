import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { UserService } from './services/users/user.service';

export const authRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handleUnauthorized(userService, req, next);
      }
      return throwError(() => error);
    })
  );
};

function handleUnauthorized(userService: UserService, req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return userService.refreshToken().pipe(
    switchMap((token) => {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(authReq);
    }),
    catchError((refreshError) => {
      userService.logout();
      return throwError(() => refreshError);
    })
  );
}
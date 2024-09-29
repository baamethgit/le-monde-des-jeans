import { HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';
import { UserService } from '../services/users/user.service';


export const interceptorJsInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const authToken = userService.getToken();
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });
  return next(authReq);
};
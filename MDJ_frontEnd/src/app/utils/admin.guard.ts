import {CanActivateFn, Router} from '@angular/router';
import {finalize, map, of} from "rxjs";
import {inject} from "@angular/core";
import {UserService} from "../services/users/user.service";
import {catchError} from "rxjs/operators";

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  let isLoading = true;
  return userService.getUser().pipe(
    finalize(() => {isLoading=false}),
    map((data) => {
      const isAdmin = data.is_staff && data.is_superuser;
      if (isAdmin) {
        return true;
      } else {
        if (!isLoading){
          router.navigate(['**']);
        }
        return false;
      }
    }),
    catchError(() => {
      return of(false);
    })
  );
};

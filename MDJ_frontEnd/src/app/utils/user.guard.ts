import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/users/user.service';

export const userGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    const userService = inject(UserService);
    const router = inject(Router);
      if (userService.loggedIn.value) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
};
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/users/user.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const userGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    const platformId = inject(PLATFORM_ID);
    const userService = inject(UserService);
    const router = inject(Router);

    if (isPlatformBrowser(platformId)) {
      if (userService.loggedIn.value) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }
    return false;
};
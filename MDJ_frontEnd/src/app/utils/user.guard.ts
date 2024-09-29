import { CanActivateFn } from '@angular/router';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/users/user.service';


export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserService);
  const router = inject(Router);

  if (authService.loggedIn.value) {
    return true;
  }
  router.navigate(['/login']);
  return false;
}
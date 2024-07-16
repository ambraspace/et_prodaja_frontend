import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);

  const router = inject(Router);

  let token = auth.getToken();

  if (token != null)
  {
    return true;
  }

  auth.returnUrl = state.url;

  return router.parseUrl("/login");

};

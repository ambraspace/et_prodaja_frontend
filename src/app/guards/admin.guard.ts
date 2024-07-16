import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);

  if (auth.getToken() != null && auth.getToken()!.role === 'ADMIN')
  {
    return true;
  }

  return false;

};

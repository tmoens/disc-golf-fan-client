import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {inject} from '@angular/core';
import {AppTools} from '../../../assets/app-tools';

export const authenticatedGuard: CanActivateFn =
  (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
     const authService = inject(AuthService);
     const router = inject(Router);
     if (!authService.isAuthenticated()) {
       authService.intendedPath = location.pathname;
       router.navigate([AppTools.LOGIN]).then();
     }
     return authService.isAuthenticated();
  };

export const roleGuard: CanActivateFn =
  (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    console.log(`hit role guard`);
  return (authService.authenticatedUserCanPerformRole(route.data['permittedRole']))
}

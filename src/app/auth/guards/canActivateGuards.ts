import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {inject} from '@angular/core';
import {AppTools} from '../../shared/app-tools';

export const authenticatedGuard: CanActivateFn =
  (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const authed = authService.isAuthenticated();
    if (!authed) {
      // Remember exactly where the user wanted to go (path + query + fragment)
      authService.intendedPath = state.url;

      // Tell the Router to redirect to the login page (no imperative navigation here)
      return router.createUrlTree([`/${AppTools.LOGIN.route}`]);
    }
    return true;
  };

export const roleGuard: CanActivateFn =
  (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
  return (authService.authenticatedUserCanPerformRole(route.data['permittedRole']))
}

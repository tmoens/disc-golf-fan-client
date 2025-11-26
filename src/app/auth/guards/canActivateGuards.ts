import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {inject} from '@angular/core';
import {DGF_TOOL_ROUTES} from '../../tools/dgf-tool-routes';

export const authenticatedGuard: CanActivateFn =
  (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const authed = authService.isAuthenticated();
    if (!authed) {
      // Remember exactly where the user wanted to go (path + query + fragment)
      authService.intendedPath = state.url;

      // Tell the Router to redirect to the login page (no imperative navigation here)
      return router.createUrlTree([`/${DGF_TOOL_ROUTES.LOGIN}`]);
    }
    return true;
  };

export const loggedOutGuard: CanActivateFn =
  (_route, _state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated()) {
      // user is already logged in → go to their home screen
      return router.createUrlTree([DGF_TOOL_ROUTES.LIVE_SCORES]);
    }
    return true;
  };

export const roleGuard: CanActivateFn =
  (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    return (authService.authenticatedUserCanPerformRole(route.data['permittedRole']));
  };

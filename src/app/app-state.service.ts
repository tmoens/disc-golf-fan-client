import {Injectable, signal} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { filter, subscribeOn } from 'rxjs/operators';
import { DGF_TOOL_ROUTES } from './tools/dgf-tool-routes';
import {DgfToolsService} from './tools/dgf-tools.service';
import {DgfTool} from './tools/dgf-tool';
import {DGF_TOOL_KEY, DgfToolKey} from './tools/dgf-took-keys';
import {AuthService} from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Signal holding the current tool metadata (undefined if no match)
  activeTool = signal<DgfTool | undefined>(undefined);

  constructor(
    private router: Router,
    private toolsService: DgfToolsService,
    private authService: AuthService,
  ) {
    this.watchRouterChanges();
  }

  initializeAppState(): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.activeTool.set(undefined);
      resolve(true);
    });
  }


  watchRouterChanges(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(event => {
        const url = event.urlAfterRedirects || '';

        const segment =
          url.split('?')[0].split('#')[0].split('/').find(Boolean) || '';

        // Ask the tool service which KEY corresponds to that route
        const key = this.toolsService.findToolKeyByRouteLiteral(segment);

        if (!key) {
          this.redirectToFallback();
          return;
        }
        const tool = this.toolsService.getByKey(key);
        if (tool?.is(DGF_TOOL_KEY.LOGOUT)) {
          this.authService.logout().subscribe();
          this.router.navigate([DGF_TOOL_ROUTES.LOGIN]);
          return
        }
        this.activeTool.set(tool);
      });
  }

  private redirectToFallback(): void {
    const user = this.authService.authenticatedUser();
    if (user) {
      this.router.navigate([DGF_TOOL_ROUTES.LIVE_SCORES]);
    } else {
      this.router.navigate([DGF_TOOL_ROUTES.LOGIN]);
    }
  }
}

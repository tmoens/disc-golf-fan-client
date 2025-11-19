import {Injectable, signal} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
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

  activateTool(key: DgfToolKey, opts?: { navigate?: boolean }): void {
    const tool = this.toolsService.getByKey(key);

    if (!tool) {
      console.warn(`Unknown tool key: ${key}`);
      return;
    }

    // Set state
    this.activeTool.set(tool);

    // Navigate to the tool's route unless opts.navigate is false
    const shouldNavigate = opts?.navigate ?? true;
    if (shouldNavigate) {
      void this.router.navigate([tool.route]);
    }
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

        // Sync active tool without navigation (because we are already at the tool's route)
        this.activateTool(key, {navigate: false});
      });
  }

  private redirectToFallback(): void {
    const user = this.authService.authenticatedUser();
    if (user) {
      this.activateTool(DGF_TOOL_KEY.LIVE_SCORES);
    } else {
      this.activateTool(DGF_TOOL_KEY.LOGIN);
    }
  }
}

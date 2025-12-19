import {Injectable, signal} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { filter } from 'rxjs/operators';
import { ScreenInfo } from './screen-info/screen-info';
import { DGF_TOOL_ROUTES } from './tools/dgf-tool-routes';
import {DgfToolsService} from './tools/dgf-tools.service';
import {DgfTool} from './tools/dgf-tool';
import {DGF_TOOL_KEY} from './tools/dgf-took-keys';
import {AuthService} from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Signal holding the current tool metadata (undefined if no match)
  activeTool = signal<DgfTool | undefined>(undefined);

  private readonly screenInfoSignal =
    signal<ScreenInfo>(this.getScreenInfo());

  readonly screenInfo = this.screenInfoSignal.asReadonly();

  constructor(
    private router: Router,
    private toolsService: DgfToolsService,
    private authService: AuthService,
  ) {
    this.watchRouterChanges();
    window.addEventListener('resize',() => this.updateScreenInfo());
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
          void this.router.navigate([DGF_TOOL_ROUTES.LOGIN]);
          return
        }
        this.activeTool.set(tool);
      });
  }

  private redirectToFallback(): void {
    const user = this.authService.authenticatedUser();
    if (user) {
      void this.router.navigate([DGF_TOOL_ROUTES.LIVE_SCORES]);
    } else {
      void this.router.navigate([DGF_TOOL_ROUTES.LOGIN]);
    }
  }

  private updateScreenInfo() {
    this.screenInfoSignal.set(this.getScreenInfo());
  }

  // This function computes everything in ONE place
  private getScreenInfo(): ScreenInfo {
    const width  = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio ?? 1;

    return new ScreenInfo(width, height, dpr);
  }

}

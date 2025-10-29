import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AppTools, ConcreteAppTool } from './shared/app-tools';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Signal holding the current tool metadata (undefined if no match)
  activeTool = signal<ConcreteAppTool | undefined>(undefined);

  constructor(private router: Router) {
    this.watchRouterChanges();
  }

  initializeAppState(): Promise<any> {
    return new Promise ((resolve, _reject) => {
      this.activeTool.set(undefined);
      resolve(true);
    });
  }

  // This is how we determine which tool is active
  private watchRouterChanges() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(event => {
        const url = event.urlAfterRedirects || '';

        // Strip query/fragment, split path, take the first non-empty segment
        const firstSegment =
          url.split('?')[0].split('#')[0].split('/').find(Boolean) || '';

        // look up the tool based on the route.
        const tool = Object.values(AppTools).find(t => t.route === firstSegment);
        this.activeTool.set(tool);
      });
  }
}

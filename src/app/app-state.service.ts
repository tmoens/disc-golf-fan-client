import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Signal holding the first non-empty path segment of the current URL (the "active tool")
  activeTool = signal<string>('');

  constructor(private router: Router) {
    this.watchRouterChanges();
  }

  initializeAppState(): Promise<any> {
    return new Promise ((resolve, _reject) => {
      this.activeTool.set('');
      resolve(true);
    });
  }

  private watchRouterChanges() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(event => {
        const url = event.urlAfterRedirects || '';
        // Strip query/fragment, split path, take first non-empty segment
        const firstSegment =
          url.split('?')[0].split('#')[0].split('/').find(Boolean) || '';
        this.activeTool.set(firstSegment);
      });
  }

  // Convenience helper for consumers
  isActive(route: string): boolean {
    return this.activeTool() === route;
  }
}

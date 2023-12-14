import { Injectable, signal, WritableSignal } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  activeTool: WritableSignal<string> = signal<string>('');

  constructor(
    private router: Router,
  ) {
    this.watchRouterChanges();
  }

  initializeAppState(): Promise<any> {
    return new Promise ((resolve, reject) => {
      this.activeTool.set('');
      resolve(true);
    });
  }

  private watchRouterChanges() {
    this.router.events.subscribe( event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects) {
          // console.log(JSON.stringify(event));
          this.activeTool.set(event.urlAfterRedirects.substring(1));
        }
      }
    });
  }

}

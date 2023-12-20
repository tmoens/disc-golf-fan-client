import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  activeTool = new BehaviorSubject<string>('');

  constructor(private router: Router) {
    this.watchRouterChanges();
  }

  initializeAppState(): Promise<any> {
    return new Promise ((resolve, _reject) => {
      this.activeTool.next('');
      resolve(true);
    });
  }

  private watchRouterChanges() {
    this.router.events.subscribe( event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects) {
          // console.log(JSON.stringify(event));
          this.activeTool.next(event.urlAfterRedirects.substring(1));
        }
      }
    });
  }
}

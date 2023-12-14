import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {

  constructor(
    private breakpointObserver: BreakpointObserver,
    ) {}

  isLargeScreen(): Observable<boolean> {
    return this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(map(result => {
        // console.log(JSON.stringify(result, null, 2));
        return result.matches;
      }));
  }
}

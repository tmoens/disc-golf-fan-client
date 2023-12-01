import {Component, OnDestroy} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';
import {BreakpointService} from './breakpoint-service.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'disc-golf-fan';
  isLargeScreen: boolean = true;
  toBeDestroyedLater: Subscription;

  constructor(
    protected authService: AuthService,
    private router: Router,
    private breakpointService: BreakpointService,
  ) {
    this.toBeDestroyedLater = this.breakpointService.isLargeScreen().subscribe( isLarge => {
      this.isLargeScreen = isLarge;
    })
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']).then();
  }

  ngOnDestroy() {
    if (this.toBeDestroyedLater) {
      this.toBeDestroyedLater.unsubscribe();
    }
  }
}

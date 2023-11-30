import { Component } from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'disc-golf-fan';
  constructor(
    protected authService: AuthService,
    private router: Router,
  ) {
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']).then();
  }
}

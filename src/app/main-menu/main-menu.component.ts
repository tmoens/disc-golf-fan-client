import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {AuthService} from '../auth/auth.service';
import {Router, RouterLink} from '@angular/router';
import {AppStateService} from '../app-state.service';
import {FanService} from '../fan/fan.service';
import {MatButtonModule} from '@angular/material/button';
import {AppTools} from '../../assets/app-tools';
import {ADMIN_ROLE} from '../auth/auth-related-dtos/roles';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, RouterLink, MatButtonModule],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {
  constructor(
    protected authService: AuthService,
    protected fanService: FanService,
    protected router: Router,
    protected appStateService: AppStateService,
  ) {
  }

  manageFavouritesDisabled(): boolean {
    return (!this.authService.isAuthenticated() ||
      this.appStateService.activeTool.value === AppTools.MANAGE_FAVOURITES.route);
  }
  liveScoresDisabled(): boolean {
    return (!this.authService.isAuthenticated() ||
      !this.fanService.fanHasFavorites() ||
      this.appStateService.activeTool.value === AppTools.LIVE_SCORES.route);
  }
  registrationDisabled(): boolean {
    return (this.authService.isAuthenticated() ||
      this.appStateService.activeTool.value === AppTools.REGISTER.route);
  }

  loginDisabled(): boolean {
    return (this.authService.isAuthenticated() ||
      this.appStateService.activeTool.value === AppTools.LOGIN.route);
  }

  logoutDisabled(): boolean {
    return (!this.authService.isAuthenticated());
  }

  welcomeDisabled(): boolean {
    return (this.appStateService.activeTool.value === AppTools.WELCOME.route);
  }

  onLogout() {
    this.authService.logout().subscribe(); // You have to subscribe or the logout will not happen.
    this.router.navigate([`/${AppTools.WELCOME.route}`]).then();
  }

  authenticatedUserIsAdmin(): boolean {
    return this.authService.authenticatedUserCanPerformRole(ADMIN_ROLE);
  }

  protected readonly AppTools = AppTools;
}

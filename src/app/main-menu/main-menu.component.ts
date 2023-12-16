import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {AuthService} from '../auth/auth.service';
import {Router, RouterLink} from '@angular/router';
import {AppStateService} from '../app-state.service';
import {AppTools} from '../app-helpers/app-tool-types';
import {FanService} from '../fan/fan.service';
import {MatButtonModule} from '@angular/material/button';

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
      this.appStateService.activeTool() === AppTools.MANAGE_FAVOURITES);
  }
  liveScoresDisabled(): boolean {
    return (!this.authService.isAuthenticated() ||
      !this.fanService.fanHasFavorites() ||
      this.appStateService.activeTool() === AppTools.LIVE_SCORES);
  }
  registrationDisabled(): boolean {
    return (this.authService.isAuthenticated() ||
      this.appStateService.activeTool() === AppTools.REGISTER);
  }

  loginDisabled(): boolean {
    return (this.authService.isAuthenticated() ||
      this.appStateService.activeTool() === AppTools.LOGIN);
  }

  logoutDisabled(): boolean {
    return (!this.authService.isAuthenticated());
  }

  welcomeDisabled(): boolean {
    return (this.appStateService.activeTool() === AppTools.WELCOME_PAGE);
  }

  onLogout() {
    this.authService.logout().subscribe(); // You have to subscribe or the logout will not happen.
    this.router.navigate([`/${AppTools.WELCOME_PAGE}`]).then();
  }

  protected readonly AppTools = AppTools;
}

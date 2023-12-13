import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {AuthService} from '../auth/auth.service';
import {Router, RouterLink} from '@angular/router';
import {AppStateService} from '../app-state.service';
import {AppTools} from '../app-helpers/app-tool-types';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, RouterLink],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {
  constructor(
    protected authService: AuthService,
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

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']).then();
  }

  protected readonly AppTools = AppTools;
}

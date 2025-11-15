import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {AuthService} from '../auth/auth.service';
import {Router, RouterLink} from '@angular/router';
import {AppStateService} from '../app-state.service';
import {MatButtonModule} from '@angular/material/button';
import {ConcreteAppTool} from '../shared/app-tools';
import {ADMIN_ROLE} from '../auth/dtos/roles';

@Component({
    selector: 'app-main-menu',
    imports: [CommonModule, MatIconModule, MatMenuModule, RouterLink, MatButtonModule],
    templateUrl: './main-menu.component.html',
    styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {
  appTools;

  constructor(
    protected authService: AuthService,
    protected router: Router,
    protected appState: AppStateService,
  ) {
    this.appTools = appState.tools;
  }

  toolDisabled(tool: ConcreteAppTool, mustBeLoggedIn = true, mustBeAdmin = false): boolean {
    if (mustBeLoggedIn && !this.authService.isAuthenticated()) return true;
    if (this.appState.activeTool() === tool) return true;
    if (mustBeAdmin && !this.authenticatedUserIsAdmin()) return true;
    else return false;
  }

  registrationDisabled(): boolean {
    return (this.authService.isAuthenticated() ||
      this.appState.activeTool() === this.appTools.REGISTER);
  }

  loginDisabled(): boolean {
    return (this.authService.isAuthenticated() ||
      this.appState.activeTool() === this.appTools.LOGIN);
  }

  logoutDisabled(): boolean {
    return (!this.authService.isAuthenticated());
  }

  welcomeDisabled(): boolean {
    return this.appState.activeTool() === this.appTools.WELCOME;
  }

  onLogout() {
    this.authService.logout().subscribe(); // trigger logout
    void this.router.navigate([`/${this.appTools.WELCOME.route}`]);
  }

  authenticatedUserIsAdmin(): boolean {
    return this.authService.authenticatedUserCanPerformRole(ADMIN_ROLE);
  }
}

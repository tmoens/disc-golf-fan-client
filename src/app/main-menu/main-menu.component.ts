import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {AuthService} from '../auth/auth.service';
import {Router, RouterLink} from '@angular/router';
import {AppStateService} from '../app-state.service';
import {MatButtonModule} from '@angular/material/button';
import { AppTools, ConcreteAppTool } from '../shared/app-tools';
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
    protected router: Router,
    protected appState: AppStateService,
  ) {
  }

  toolDisabled(tool: ConcreteAppTool, mustBeLoggedIn = true, mustBeAdmin = false): boolean {
    if (mustBeLoggedIn && !this.authService.isAuthenticated()) return true;
    if (this.appState.activeTool() === tool) return true;
    if (mustBeAdmin && !this.authenticatedUserIsAdmin()) return true;
    else return false;
  }
  registrationDisabled(): boolean {
    return (this.authService.isAuthenticated() ||
      this.appState.activeTool() === AppTools.REGISTER);
  }

  loginDisabled(): boolean {
    return (this.authService.isAuthenticated() ||
      this.appState.activeTool() === AppTools.LOGIN);
  }

  logoutDisabled(): boolean {
    return (!this.authService.isAuthenticated());
  }

  welcomeDisabled(): boolean {
    return this.appState.activeTool() === AppTools.WELCOME;
  }

  onLogout() {
    this.authService.logout().subscribe(); // trigger logout
    void this.router.navigate([`/${AppTools.WELCOME.route}`]);
  }

  authenticatedUserIsAdmin(): boolean {
    return this.authService.authenticatedUserCanPerformRole(ADMIN_ROLE);
  }

  protected readonly AppTools = AppTools;
}

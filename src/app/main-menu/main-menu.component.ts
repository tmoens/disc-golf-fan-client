import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {DgfToolsService} from '../tools/dgf-tools.service';
import {DgfTool} from '../tools/dgf-tool';
import {AppStateService} from '../app-state.service';
import {AuthService} from '../auth/auth.service';
import {User} from '../auth/user';

@Component({
  selector: 'app-main-menu',
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent implements OnInit {
  sortedMainMenuTools: readonly DgfTool[] = [];

  constructor(
    private toolService: DgfToolsService,
    private readonly appState: AppStateService,
    private readonly auth: AuthService,
  ) {
  }

  ngOnInit() {
    this.sortedMainMenuTools = this.toolService.getToolsForMainMenu();
  }

  isActive(tool: DgfTool): boolean {
    return (!this.appState.activeTool()?.is(tool.key));
  }

  isVisible(tool: DgfTool): boolean {
    if (!tool.show) return false;

    const user: User | null = this.auth.authenticatedUser();

    // 2. Check login state
    switch (tool.loginState) {
      case 'loggedIn':
        if (!user) return false;
        break;
      case 'loggedOut':
        if (user) return false;
        break;
      case 'either':
      default:
        break;
    }

    // 3. Check role (if any)
    if (tool.requiredRole) {
      if (!user) return false;
      if (!user.canPerformRole(tool.role)) return false;
    }
    return true;
  }

  isDisabled(tool: DgfTool): boolean {
    // Simple rule: disable if it's already active.
    return !this.isActive(tool);
  }

  onClick(tool: DgfTool): void {
    if (this.isDisabled(tool) || !this.isVisible(tool)) return;
    this.appState.activateTool(tool.key);
  }
}

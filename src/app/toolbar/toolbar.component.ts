import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AppStateService} from '../app-state.service';
import {AuthService} from '../auth/auth.service';
import {MainMenuComponent} from '../main-menu/main-menu.component';
import {DGF_TOOL_KEY} from '../tools/dgf-took-keys';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MainMenuComponent,
    MatMenuModule,
    MatTooltipModule,
  ],
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  @Input() titlePrefix = 'Disc Golf Fan';

  constructor(
    protected readonly appState: AppStateService,
    protected readonly authService: AuthService,
  ) {
  }

  get activeTool() {
    return this.appState.activeTool();
  }

  onLoginClick() {
    this.appState.activateTool(DGF_TOOL_KEY.LOGIN);
  }

  onLogoutClick() {
    this.authService.logout().subscribe(); // trigger logout
    this.appState.activateTool(DGF_TOOL_KEY.WELCOME);
  }
}

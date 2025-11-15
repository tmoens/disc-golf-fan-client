import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Router, RouterLink} from '@angular/router';
import {AppStateService} from '../app-state.service';
import {AuthService} from '../auth/auth.service';
import {MainMenuComponent} from '../main-menu/main-menu.component';
import {AppTools} from '../shared/app-tools';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MainMenuComponent,
    MatMenuModule,
    MatTooltipModule,
    RouterLink,
  ],
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  @Input() titlePrefix = 'Disc Golf Fan';
  protected readonly appState = inject(AppStateService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  get activeTool() {
    return this.appState.activeTool();
  }

  onLoginClick() {
    void this.router.navigate([`/${AppTools.LOGIN.route}`]);
  }

  onLogoutClick() {
    this.authService.logout().subscribe(); // trigger logout
    void this.router.navigate([`/${AppTools.WELCOME.route}`]);
  }

  protected readonly AppTools = AppTools;
}

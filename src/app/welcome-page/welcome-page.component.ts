import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {AuthService} from '../auth/auth.service';
import {MatToolbarModule} from '@angular/material/toolbar';
import {ToolbarComponent} from '../toolbar/toolbar.component';
import {AppStateService} from '../app-state.service';
import {DGF_TOOL_KEY} from '../tools/dgf-took-keys';

@Component({
  selector: 'app-welcome-page',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatListModule, MatToolbarModule, ToolbarComponent],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {

  constructor(
    protected authService: AuthService,
    private appStateService: AppStateService,
  ) {
  }

  register() {
    this.appStateService.activateTool(DGF_TOOL_KEY.REGISTER);
  }

  login() {
    this.appStateService.activateTool(DGF_TOOL_KEY.LOGIN);
  }

  logout() {
    this.authService.logout().subscribe(); // trigger logout
  }
}

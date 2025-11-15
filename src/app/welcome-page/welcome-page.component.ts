import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { AuthService } from '../auth/auth.service';
import {MainMenuComponent} from '../main-menu/main-menu.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AppTools } from '../shared/app-tools';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
    selector: 'app-welcome-page',
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatListModule, MainMenuComponent, MatToolbarModule, ToolbarComponent],
    templateUrl: './welcome-page.component.html',
    styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {

  constructor(
    protected authService: AuthService,
    private router: Router,
  ) {
  }

  register() {
    this.router.navigate([`/${AppTools.REGISTER.route}`]);
  }
  login() {
    this.router.navigate([`/${AppTools.LOGIN.route}`]);
  }

  logout() {
    this.authService.logout().subscribe(); // trigger logout
  }

}

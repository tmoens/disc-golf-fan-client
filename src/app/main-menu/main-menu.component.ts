import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {AuthService} from '../auth/auth.service';
import {Router, RouterLink} from '@angular/router';

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
  ) {
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']).then();
  }
}

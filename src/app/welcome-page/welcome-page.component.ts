import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {BreakpointService} from '../breakpoint-service.service';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {

  constructor(
    private router: Router,
    private breakpointService: BreakpointService,
  ) {
    this.breakpointService.isLargeScreen().subscribe(value => {
      console.log(`From welcome page: ${value}`)
    })
  }

  register() {
    this.router.navigate(['register']).then();
  }
  login() {
    this.router.navigate(['login']).then();
  }
}

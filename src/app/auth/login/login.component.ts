import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {LoginDto} from '../auth-related-dtos/login-dto';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {Router, RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MainMenuComponent} from '../../main-menu/main-menu.component';
import {MatToolbarModule} from '@angular/material/toolbar';

enum LoginStatus {
  TBD,
  SUCCESS,
  FAIL,
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, ReactiveFormsModule, MatInputModule, RouterLink, MatButtonModule, MainMenuComponent, MatToolbarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  loginStatus = LoginStatus.TBD;
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, ]],
  });
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      const loginDto: LoginDto = this.loginForm.value;
      this.authService.login(loginDto).subscribe({
        next: () => {
          this.loginStatus = LoginStatus.SUCCESS;
          this.loginError = null;
          this.router.navigate(['/live-scores']).then();
        },
        error: (error) => {
          this.loginStatus = LoginStatus.FAIL;
          this.loginError = error.error.message;
          // this.loginError = JSON.stringify(error, null, 2);
        }
      });
    }
  }
}

import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {EmailValidator, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {LoginDto} from '../DTOs/auth-related/login-dto';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

enum LoginStatus {
  TBD,
  SUCCESS,
  FAIL,
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, ReactiveFormsModule, MatInputModule, RouterLink, MatButtonModule],
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
  ) {}

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginDto: LoginDto = this.loginForm.value;
      this.authService.login(loginDto).subscribe({
        next: () => {
          this.loginStatus = LoginStatus.SUCCESS;
          this.loginError = null;
        },
        error: (error) => {
          this.loginStatus = LoginStatus.FAIL;
          this.loginError = JSON.stringify(error, null, 2);
        }
      });
    }
  }
}

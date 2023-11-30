import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router, RouterLink} from '@angular/router';
import {ForgotPasswordDto} from '../auth-related-dtos/forgot-password-dto';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  message = '';
  form: FormGroup = this.fb.group ( {
    email: ['', [Validators.required, Validators.email]],
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  onSubmit() {
    if (this.form.valid) {
      const forgotPasswordDto: ForgotPasswordDto = this.form.value;
      this.authService.forgotPassword(forgotPasswordDto)
        .subscribe((data) => {
        if (data === null || !data) {
          this.message = 'You should receive an e-mail shortly with a link to reset your password.';
        } else {
          this.message = `No user with that email address. ${data}`;
        }
      });
    }
  }
}

import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

enum ConfirmationStatus {
  TBD,
  SUCCESSFUL,
  FAILED,
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  protected readonly ConfirmationStatus = ConfirmationStatus;
  confirmationResultMessage: string = '';
  confirmationStatus = ConfirmationStatus.TBD;
  passwordResetToken: string | null = null;

  form: FormGroup = this.fb.group ( {
    password: ['', [Validators.required, Validators.minLength(1)]],
  })

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.passwordResetToken = this.route.snapshot.queryParamMap.get('token');
    if (!this.passwordResetToken) {
      this.confirmationStatus = ConfirmationStatus.FAILED;
      this.confirmationResultMessage = `No token provided. You been goofin' wit' da bees?`;
    }
  }

  onSubmit() {
    if (this.form.valid && this.passwordResetToken) {
      this.authService.resetPassword({
        resetPasswordToken: this.passwordResetToken,
        newPassword: this.form.controls['password'].value,
      }).subscribe(async (message) => {
        if (message === null) {
          this.confirmationStatus = ConfirmationStatus.SUCCESSFUL;
          this.confirmationResultMessage = 'Your password has been changed';
        } else {
          this.confirmationStatus = ConfirmationStatus.FAILED;
          this.confirmationResultMessage = message;
        }
      });
    }
  }

  // It would be exceedingly weird for this to ever happen in production
  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']).then();
  }

  navigateToLogin() {
    this.router.navigate(['/login']).then();
  }
}

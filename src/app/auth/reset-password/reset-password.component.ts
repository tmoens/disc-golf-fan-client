import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import { DgfActionRowComponent } from '../../app-helpers/action-row.component';
import { DgfComponentContainerComponent } from '../../dgf-component-container/dgf-component-container.component';
import { LoaderService } from '../../loader.service';
import { DGF_TOOL_ROUTES } from '../../tools/dgf-tool-routes';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

enum ConfirmationStatus {
  TBD,
  SUCCESSFUL,
  FAILED,
}

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    DgfComponentContainerComponent,
    DgfActionRowComponent,
    MatIcon,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  passwordVisible = false;
  protected readonly ConfirmationStatus = ConfirmationStatus;
  confirmationResultMessage: string | null = null;
  confirmationStatus = ConfirmationStatus.TBD;
  passwordResetToken: string | null = null;

  form: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(1)]],
  });

  constructor(
    private route: ActivatedRoute,
    private loader: LoaderService,
    private router: Router,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.passwordResetToken = this.route.snapshot.queryParamMap.get('token');
    if (!this.passwordResetToken) {
      this.confirmationStatus = ConfirmationStatus.FAILED;
      this.confirmationResultMessage = `No token provided. You been goofin' wit' da bees?`;
    }
  }

  onSubmit() {
    if (this.form.valid && this.passwordResetToken) {
      this.loader.resetPassword({
        resetPasswordToken: this.passwordResetToken,
        newPassword: this.form.controls['password'].value,
      }).subscribe({
        next: (userDtoOrNull) => {
          if (userDtoOrNull) {
            // Success — got a real UserDto
            this.confirmationStatus = ConfirmationStatus.SUCCESSFUL;
            this.confirmationResultMessage = `Password reset successful. You may now log in with your new password.`;
          } else {
            // Other errors (500/network/etc.) — handled by snackbar
            this.confirmationStatus = ConfirmationStatus.FAILED;
            this.confirmationResultMessage = `Unknown error occurred. Please try again.`;
          }
        },

        error: (errMessage) => {
          // This happens ONLY on 400, where we re-throw a string
          this.confirmationStatus = ConfirmationStatus.FAILED;
          this.confirmationResultMessage = errMessage;   // string from server
        }
      })
    }
  }

  // It would be exceedingly unusual for this to ever happen in production
  navigateToForgotPassword() {
    this.router.navigate([DGF_TOOL_ROUTES.FORGOT_PASSWORD]);
  }

  navigateToLogin() {
    this.router.navigate([DGF_TOOL_ROUTES.LOGIN]);
  }
}

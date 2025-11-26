import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { DgfActionRowComponent } from '../../app-helpers/action-row.component';
import { DgfComponentContainerComponent } from '../../dgf-component-container/dgf-component-container.component';
import {AuthService} from '../auth.service';
import {ForgotPasswordDto} from '../dtos/forgot-password-dto';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
    selector: 'app-forgot-password',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    DgfComponentContainerComponent,
    DgfActionRowComponent,
  ],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  message = '';
  errorMessage = '';
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
  }

  onSubmit() {
    if (this.form.valid) {
      const forgotPasswordDto: ForgotPasswordDto = this.form.value;
      this.authService.forgotPassword(forgotPasswordDto)
        .subscribe((data) => {
          if (data === null || !data) {
            this.message = 'You should receive an e-mail shortly with a link to reset your password.';
            this.errorMessage = '';
          } else {
            this.errorMessage = `${data}`;
            this.message = '';
          }
        });
    }
  }
}

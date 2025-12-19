import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { DgfActionRowComponent } from '../../app-helpers/action-row.component';
import { DgfComponentContainerComponent } from '../../dgf-component-container/dgf-component-container.component';
import { LoaderService } from '../../loader.service';
import {ForgotPasswordDto} from '../dtos/forgot-password-dto';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  standalone: true,
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
  message: string | null = null;
  errorMessage: string | null = null;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private loader: LoaderService,
  ) {
  }

  onSubmit() {
    if (this.form.valid) {
      const forgotPasswordDto: ForgotPasswordDto = this.form.value;
      this.loader.forgotPassword(forgotPasswordDto).subscribe({
        next: (response) => {
          if (response) {
            // Success — got a real UserDto
            this.message = response;
            this.errorMessage = null;
          } else {
            // Other errors (500/network/etc.) — handled by snackbar
            this.message = null;
            this.errorMessage = null;
          }
        },

        error: (errMessage) => {
          // This happens ONLY on 400, where we re-throw a string
          this.message = null;
          this.errorMessage = errMessage;   // string from server
        }
      })
    }
  }
}

import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { DgfComponentContainerComponent } from '../dgf-component-container/dgf-component-container.component';
import {RegistrationDto} from '../auth/dtos/registration-dto';
import {plainToInstance} from 'class-transformer';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    DgfComponentContainerComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  registerForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', Validators.required],
    registrationCode: ['', Validators.required]
  });

  errorMessage: string = '';
  registrationSuccessful = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      const registrationDto = plainToInstance(RegistrationDto, this.registerForm.value);
      this.authService.register(registrationDto)
        .subscribe((data) => {
          if (data === null || !data) {
            this.registrationSuccessful = true;
          } else {
            this.registrationSuccessful = false;
            this.errorMessage = `${data}`;
          }
        });
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {LoaderService} from '../loader.service';
import {RegistrationDto} from '../DTOs/auth-related/registration-dto';
import {plainToInstance} from 'class-transformer';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup | undefined;
  message: string = '';
  registrationSuccessful = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', Validators.required],
      registrationCode: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm?.valid) {
      console.log('Registration Data:', this.registerForm.value);
      const registrationDto = plainToInstance(RegistrationDto, this.registerForm.value);
      this.authService.register(registrationDto)
        .subscribe((data) => {
          if (data === null || !data) {
            this.registrationSuccessful = true;
            this.message = 'Your registration was successful, you should receive an e-mail' +
              ' shortly so you can validate the email you supplied.';
          } else {
            this.registrationSuccessful = false;
            this.message = `Registration was unsuccessful. ${data}`;
          }
        });
    }
  }
}

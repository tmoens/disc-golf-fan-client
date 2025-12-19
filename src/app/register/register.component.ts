import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { DgfComponentContainerComponent } from '../dgf-component-container/dgf-component-container.component';
import {RegistrationDto} from '../auth/dtos/registration-dto';
import {plainToInstance} from 'class-transformer';
import { LoaderService } from '../loader.service';

@Component({
  standalone: true,
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

export class RegisterComponent implements OnInit {
  registerForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', Validators.required],
    registrationCode: ['', Validators.required]
  });

  errorMessage: string | null = null;
  registrationSuccessful = false;

  constructor(
    private formBuilder: FormBuilder,
    private loader: LoaderService
  ) {}

  ngOnInit() {
    this.registerForm.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = null;
      }
    });
  }

  onSubmit(): void {
    if (!this.registerForm.valid) {
      return
    }
    const registrationDto = plainToInstance(RegistrationDto, this.registerForm.value);
    this.loader.register(registrationDto).subscribe({
      next: (userDtoOrNull) => {
        if (userDtoOrNull) {
          // Success — got a real UserDto
          this.registrationSuccessful = true;
          this.errorMessage = null;
        } else {
          // Other errors (500/network/etc.) — handled by snackbar
          this.registrationSuccessful = false;
          this.errorMessage = null;
        }
      },

      error: (errMessage) => {
        // This happens ONLY on 400, where we re-throw a string
        this.registrationSuccessful = false;
        this.errorMessage = errMessage;   // string from server
      }
    })
  }
}

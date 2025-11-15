import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {AppTools} from '../../shared/app-tools';
import {ToolbarComponent} from '../../toolbar/toolbar.component';
import {RegistrationDto} from '../dtos/registration-dto';
import {plainToInstance} from 'class-transformer';
import {AuthService} from '../auth.service';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, ToolbarComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  registerForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    password: ['', Validators.required],
    registrationCode: ['', Validators.required]
  });

  message: string = '';
  registrationSuccessful = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
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

  protected readonly AppTools = AppTools;
}

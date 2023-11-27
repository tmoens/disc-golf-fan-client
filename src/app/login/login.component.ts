import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../auth/auth.service';
import {LoginDto} from '../DTOs/auth-related/login-dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  usernameFC: FormControl = new FormControl<string>('');
  passwordFC: FormControl = new FormControl<string>('');

  constructor(
    private authService: AuthService,
  ) {
  }

  onSubmit() {
    const loginDto: LoginDto = { email: this.usernameFC.value, password: this.passwordFC.value }
    this.authService.login(loginDto).subscribe( (token: any) => {
  }


}

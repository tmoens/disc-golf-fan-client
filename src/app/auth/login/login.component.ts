import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize} from 'rxjs';
import { DgfActionRowComponent } from '../../app-helpers/action-row.component';
import { DgfComponentContainerComponent } from '../../dgf-component-container/dgf-component-container.component';
import { DGF_TOOL_KEY } from '../../tools/dgf-took-keys';
import { DgfTool } from '../../tools/dgf-tool';
import { DgfToolsService } from '../../tools/dgf-tools.service';
import {AuthService} from '../auth.service';
import {LoginDto} from '../dtos/login-dto';
import {MatInputModule} from '@angular/material/input';
import {Router, RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {DGF_TOOL_ROUTES} from '../../tools/dgf-tool-routes';

enum LoginStatus {
  TBD,
  SUCCESS,
  FAIL,
}

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterLink,
    MatButtonModule,
    DgfComponentContainerComponent,
    DgfActionRowComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  fogotPasswordTool: DgfTool;
  loginStatus = LoginStatus.TBD;
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required,]],
  });
  loginError: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toolService: DgfToolsService,
    private router: Router,
  ) {
    this.fogotPasswordTool =  this.toolService.getByKey(DGF_TOOL_KEY.FORGOT_PASSWORD);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const loginDto: LoginDto = this.loginForm.value;

    this.authService.login(loginDto).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
        this.loginStatus = LoginStatus.SUCCESS;
        this.loginError = null;

        const target = this.authService.intendedPath && this.authService.intendedPath.startsWith('/')
          ? this.authService.intendedPath
          : DGF_TOOL_ROUTES.LIVE_SCORES;

        void this.router.navigateByUrl(target);
        this.authService.intendedPath = null as any; // or undefined, depending on your field type
      },
      error: (message: string) => {
        // AuthService.login now throws a normalized string message
        this.loginStatus = LoginStatus.FAIL;
        this.loginError = message || 'Sign-in failed. Please try again.';
      }
    });
  }

  onForgotPasswordClick() {
    void this.router.navigate([this.fogotPasswordTool.route]);
  }

  protected readonly DGF_TOOL_ROUTES = DGF_TOOL_ROUTES;
}

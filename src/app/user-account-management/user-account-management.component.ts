import { Component, effect } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { DgfActionRowComponent } from '../app-helpers/action-row.component';
import { FadeMessageComponent } from '../app-helpers/fade-message/fade-message.component';
import { DgfComponentContainerComponent } from '../dgf-component-container/dgf-component-container.component';
import { UserDto } from '../fan/dtos/user.dto';
import { FanService } from '../fan/fan.service';
import { DGF_TOOL_ROUTES } from '../tools/dgf-tool-routes';
import { ChangeEmailDto } from './change-email.dto';
import { ChangeNameDto } from './change-name.dto';

@Component({
  selector: 'app-user-account-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DgfComponentContainerComponent,
    MatButton,
    FadeMessageComponent,
    DgfActionRowComponent,
  ],
  templateUrl: './user-account-management.component.html',
  styleUrl: './user-account-management.component.scss'
})
export class UserAccountManagementComponent {
  userThreatenedToDeleteAccount = false;
  user: UserDto | undefined;
  emailFC = new FormControl<string>('', [
    Validators.required,
    Validators.email
  ]);

  nameFC = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(80),
  ]);

  // store original values to detect “dirty but meaningful”
  originalEmail = '';
  originalName = '';

  requestEmailConfirmationMessage: string | null = null;
  nameChangeConfirmationMessage: string | null = null;
  emailChangeConfirmationMessage: string | null = null;

  constructor(
    private fanService: FanService,
    private router: Router,
  ) {

    // Whenever fan changes → reinitialize.
    effect(() => {
      const fan = this.fanService.fanSignal();
      if (fan?.user) {
        this.reinitializeForm(fan.user);
      }
    });
  }

  // -------------------------------------------------------------------
  // FORM INITIALIZATION
  // -------------------------------------------------------------------

  private reinitializeForm(user: UserDto) {
    this.user = user;
    this.originalEmail = user.email ?? '';
    this.originalName = user.name ?? '';

    this.emailFC.setValue('');
    this.emailFC.markAsPristine();
    this.emailFC.markAsUntouched();
    this.emailFC.updateValueAndValidity({ onlySelf: true, emitEvent: false });

    this.nameFC.setValue('');
    this.nameFC.markAsPristine();
    this.nameFC.markAsUntouched();
    this.nameFC.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }


  // -------------------------------------------------------------------
  // CAN-SAVE LOGIC
  // -------------------------------------------------------------------

  get canSaveEmail(): boolean {
    return (
      this.emailFC.valid &&
      this.emailFC.value !== this.originalEmail
    );
  }

  get canSaveName(): boolean {
    return (
      this.nameFC.valid &&
      this.nameFC.value !== this.originalName
    );
  }

  // -------------------------------------------------------------------
  // ACTIONS
  // -------------------------------------------------------------------

  saveEmail() {
    if (!this.canSaveEmail) return;
    const dto: ChangeEmailDto = new ChangeEmailDto(this.emailFC.value!);
    this.fanService.changeMyEmail(dto).subscribe(result => {
      if (result) {
        this.emailChangeConfirmationMessage = "Email changed, confirmation request sent.";
      } else {
        this.emailChangeConfirmationMessage = "Things do not always work out. This didn't.";
      }

    });
  }

  saveName() {
    if (!this.canSaveName) return;
    const dto: ChangeNameDto = new ChangeNameDto(this.nameFC.value!);
    this.fanService.changeMyName(dto).subscribe( result => {
      if (result) {
        this.nameChangeConfirmationMessage = "Username changed successfully.";
      } else {
        this.nameChangeConfirmationMessage = "Yikes, glitch in the matrix username change failed.";
      }
    });
  }

  requestEmailConfirmationEmail() {
    this.fanService.requestEmailConfirmationEmail().subscribe(result => {
      if (result) {
        this.requestEmailConfirmationMessage = `Confirmation req sent to ${this.user?.email} any previous ones are void.`;
      } else {
        this.requestEmailConfirmationMessage =
          "Oopsy, that didn't work at all. Sorry. Yell at the developer if you know them.";
      }
    });
  }

  threatenToDeleteAccount() {
    this.userThreatenedToDeleteAccount = true;
  }

  unThreatenToDeleteAccount() {
    this.userThreatenedToDeleteAccount = false;
  }

  deleteMyAccount() {
    this.fanService.deleteMyAccount().subscribe({
      next: () => {
        void this.router.navigate([DGF_TOOL_ROUTES.LOGOUT]);
      }
    });
  }
}

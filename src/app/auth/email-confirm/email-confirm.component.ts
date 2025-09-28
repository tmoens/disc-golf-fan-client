import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { firstValueFrom } from 'rxjs';
import { AppTools } from '../../shared/app-tools';
import {AuthService} from '../auth.service';
import {MainMenuComponent} from '../../main-menu/main-menu.component';
import {MatToolbarModule} from '@angular/material/toolbar';

enum ConfirmationStatus {
  TBD,
  SUCCESSFUL,
  FAILED,
}

@Component({
  selector: 'app-email-confirm',
  standalone: true,
  imports: [CommonModule, MatCardModule, MainMenuComponent, MatToolbarModule],
  templateUrl: './email-confirm.component.html',
  styleUrl: './email-confirm.component.scss'
})
export class EmailConfirmComponent {
  confirmationResultMessage: string = '';
  confirmationStatus = ConfirmationStatus.TBD;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.confirmationStatus = ConfirmationStatus.FAILED;
      this.confirmationResultMessage = `No token provided. You been goofin' wit' da bees?`;
      return;
    }

    const message = await firstValueFrom(this.authService.confirmEmail(token));
    if (message === null) {
      this.confirmationStatus = ConfirmationStatus.SUCCESSFUL;
      this.confirmationResultMessage = 'Your email was confirmed';
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.navigateToLogin();
    } else {
      this.confirmationStatus = ConfirmationStatus.FAILED;
      this.confirmationResultMessage = message;
    }
  }

  navigateToLogin()
  {
     void this.router.navigate([`/${AppTools.LOGIN.route}`]);
  }

  protected readonly AppTools = AppTools;
}

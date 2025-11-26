import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {firstValueFrom} from 'rxjs';
import { DgfComponentContainerComponent } from '../../dgf-component-container/dgf-component-container.component';
import { DGF_TOOL_ROUTES } from '../../tools/dgf-tool-routes';
import {AuthService} from '../auth.service';

enum ConfirmationStatus {
  TBD,
  SUCCESSFUL,
  FAILED,
}

@Component({
  selector: 'app-email-confirm',
  imports: [
    CommonModule,
    DgfComponentContainerComponent,
  ],
  templateUrl: './email-confirm.component.html',
  styleUrl: './email-confirm.component.scss'
})
export class EmailConfirmComponent implements OnInit {
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
      this.router.navigate([DGF_TOOL_ROUTES.LOGIN]);
    } else {
      this.confirmationStatus = ConfirmationStatus.FAILED;
      this.confirmationResultMessage = message;
    }
  }
}

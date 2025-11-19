import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {firstValueFrom} from 'rxjs';
import {AuthService} from '../auth.service';
import {MatToolbarModule} from '@angular/material/toolbar';
import {ToolbarComponent} from '../../toolbar/toolbar.component';
import {AppStateService} from '../../app-state.service';
import {DGF_TOOL_KEY} from '../../tools/dgf-took-keys';

enum ConfirmationStatus {
  TBD,
  SUCCESSFUL,
  FAILED,
}

@Component({
  selector: 'app-email-confirm',
  imports: [CommonModule, MatCardModule, MatToolbarModule, ToolbarComponent],
  templateUrl: './email-confirm.component.html',
  styleUrl: './email-confirm.component.scss'
})
export class EmailConfirmComponent implements OnInit {
  confirmationResultMessage: string = '';
  confirmationStatus = ConfirmationStatus.TBD;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private appStateService: AppStateService,
  ) {
  }

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
      this.appStateService.activateTool(DGF_TOOL_KEY.LOGIN);
    } else {
      this.confirmationStatus = ConfirmationStatus.FAILED;
      this.confirmationResultMessage = message;
    }
  }
}

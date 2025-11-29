import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {firstValueFrom} from 'rxjs';
import { DgfComponentContainerComponent } from '../../dgf-component-container/dgf-component-container.component';
import { LoaderService } from '../../loader.service';
import { DGF_TOOL_ROUTES } from '../../tools/dgf-tool-routes';

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
  confirmationResultMessage: string | null = null;
  confirmationStatus = ConfirmationStatus.TBD;

  constructor(
    private route: ActivatedRoute,
    private loader: LoaderService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.confirmationStatus = ConfirmationStatus.FAILED;
      this.confirmationResultMessage = `No token provided. You been goofin' wit' da bees?`;
      return;
    }

    const message = await firstValueFrom(this.loader.confirmEmail(token));

    if (message === null) {
      // Loader swallowed the error and showed the snackbar.
      // Treat as failure.
      this.confirmationStatus = ConfirmationStatus.FAILED;
      this.confirmationResultMessage = message;

    } else {
      this.confirmationStatus = ConfirmationStatus.SUCCESSFUL;
      this.confirmationResultMessage = 'Your email was confirmed';
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.router.navigate([DGF_TOOL_ROUTES.LOGIN]);
    }
  }
}

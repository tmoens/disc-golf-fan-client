import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CdkDrag, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {FormsModule} from '@angular/forms';
import {MainMenuComponent} from '../main-menu/main-menu.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {SmallScreenScoreDetails} from '../live-scores/small-screen-score-details/small-screen-score-details.component';
import {SmallScreenScorelineComponent} from '../live-scores/small-screen-scoreline/small-screen-scoreline.component';
import {AdminDashboardService} from './admin-dashboard.service';
import {MatListModule} from '@angular/material/list';
import {AuthService} from '../auth/auth.service';
import {ADMIN_ROLE} from '../auth/auth-related-dtos/roles';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDragHandle, CdkDropList, FormsModule, MainMenuComponent, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatToolbarModule, MatExpansionModule, SmallScreenScoreDetails, SmallScreenScorelineComponent, MatListModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  constructor(
    protected adminDashboardService: AdminDashboardService,
    private authService: AuthService,
  ) {
  }

  onCronStatusOpened() {
    this.adminDashboardService.startCronJobStatusPolling();
  }
  onPdgaApiRequestQueueStatusOpened() {
    this.adminDashboardService.startPdgaApiRequestQueueStatusPolling();
  }
  onRosterChangeStatusOpened() {
    this.adminDashboardService.startTournamentRosterChangeStatusPolling();
  }

  adminDashboarcAllowed() {
    this.authService.authenticatedUserCanPerformRole(ADMIN_ROLE)
  }

}

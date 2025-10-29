import { Injectable, effect } from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {AppStateService} from '../app-state.service';
import {LoaderService} from '../loader.service';
import {AppTools} from '../shared/app-tools';
import {CronJobStatusDto} from './cron-job-status.dto';
import {PdgaApiRequestSummaryDto} from './pdga-api-request-summary.dto';
import {TournamentRosterChangeDto} from './tournament-roster-change.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  constructor(    private appStateService: AppStateService,
                  private loaderService: LoaderService,
  ) {
    // React to selected tool changes
    effect(() => {
      const tool = this.appStateService.activeTool();
      if (!tool || tool.route !== AppTools.ADMIN_DASHBOARD.route) {
        this.stopPolling();
      }
    });
  }

  pollingSubscription: Subscription | null = null;

  private _cronJobStatus: CronJobStatusDto[] = [];
  get cronJobStatus(): CronJobStatusDto[] {
    return this._cronJobStatus;
  }
  set cronJobStatus(value: CronJobStatusDto[]) {
    this._cronJobStatus = value;
  }

  private _pdgaApiRequestQueueStatus: PdgaApiRequestSummaryDto[] = [];
  get pdgaApiRequestQueueStatus(): PdgaApiRequestSummaryDto[] {
    return this._pdgaApiRequestQueueStatus;
  }
  set pdgaApiRequestQueueStatus(value: PdgaApiRequestSummaryDto[]) {
    this._pdgaApiRequestQueueStatus = value;
  }

  private _tournamentRosterChangeStatus: TournamentRosterChangeDto[] = [];
  get tournamentRosterChangeStatus(): TournamentRosterChangeDto[] {
    return this._tournamentRosterChangeStatus;
  }
  set tournamentRosterChangeStatus(value: TournamentRosterChangeDto[]) {
    this._tournamentRosterChangeStatus = value;
  }

  stopPolling() {
    if (this.pollingSubscription) this.pollingSubscription.unsubscribe();
  }

  startCronJobStatusPolling() {
    this.stopPolling();
    this.getCronJobStatus();
    this.pollingSubscription = interval(environment.polling.adminDashMs).subscribe(() => {
      this.getCronJobStatus();
    });
  }

  getCronJobStatus() {
    this.loaderService.getCronJobStatus().subscribe((status: any) => {
      this.cronJobStatus = status as CronJobStatusDto[];
    });
  }

  startPdgaApiRequestQueueStatusPolling() {
    this.stopPolling();
    this.getPdgaApiRequestQueueStatus();
    this.pollingSubscription = interval(environment.polling.adminDashMs).subscribe(() => {
      this.getPdgaApiRequestQueueStatus();
    });
  }

  getPdgaApiRequestQueueStatus() {
    this.loaderService.getPdgaApiRequestQueueStatus().subscribe((status: any) => {
      this.pdgaApiRequestQueueStatus = status as PdgaApiRequestSummaryDto[];
    });
  }

  startTournamentRosterChangeStatusPolling() {
    this.stopPolling();
    this.getTournamentRosterChangeStatus();
    this.pollingSubscription = interval(environment.polling.adminDashMs).subscribe(() => {
      this.getTournamentRosterChangeStatus();
    });
  }

  getTournamentRosterChangeStatus() {
    this.loaderService.getTournamentRosterChanges().subscribe((status: any) => {
      this.tournamentRosterChangeStatus = status as TournamentRosterChangeDto[];
    });
  }
}

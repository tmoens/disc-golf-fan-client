import { Injectable } from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {AppStateService} from '../app-state.service';
import {LoaderService} from '../loader.service';
import {AppTools} from '../../assets/app-tools';
import {CronJobStatusDto} from './cron-job-status.dto';
import {PdgaApiRequestSummaryDto} from './pdga-api-request-summary.dto';
import {TournamentRosterChangeDto} from './tournament-roster-change.dto';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  constructor(    private appStateService: AppStateService,
                  private loaderService: LoaderService,
  ) {
    this.appStateSubscription = this.appStateService.activeTool.subscribe((activeTool: string) => {
      if (activeTool !== AppTools.LIVE_SCORES.route) {
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

  // We watch the app state to see if we should be polling the server or not.
  appStateSubscription: Subscription;


  stopPolling() {
    if (this.pollingSubscription) this.pollingSubscription.unsubscribe();
  }

  startCronJobStatusPolling() {
    this.stopPolling();
    this.getCronJobStatus();
    this.pollingSubscription = interval(2000).subscribe(() => {
      this.getCronJobStatus();
    });
  }


  // invoke the loader to ge cronJob status and store the result in an attribute
  getCronJobStatus() {
    this.loaderService.getCronJobStatus().subscribe((status: any) => {
      this.cronJobStatus = status as CronJobStatusDto[];
    });
  }

  startPdgaApiRequestQueueStatusPolling() {
    this.stopPolling();
    this.getPdgaApiRequestQueueStatus();
    this.pollingSubscription = interval(2000).subscribe(() => {
      this.getPdgaApiRequestQueueStatus();
    });
  }

  // invoke the loader to ge cronJob status and store the result in an attribute
  getPdgaApiRequestQueueStatus() {
    this.loaderService.getPdgaApiRequestQueueStatus().subscribe((status: any) => {
      this.pdgaApiRequestQueueStatus = status as PdgaApiRequestSummaryDto[];
    });
  }

  startTournamentRosterChangeStatusPolling() {
    this.stopPolling();
    this.getTournamentRosterChangeStatus();
    this.pollingSubscription = interval(2000).subscribe(() => {
      this.getTournamentRosterChangeStatus();
    });
  }

  // invoke the loader to ge cronJob status and store the result in an attribute
  getTournamentRosterChangeStatus() {
    this.loaderService.getTournamentRosterChanges().subscribe((status: any) => {
      this.tournamentRosterChangeStatus = status as TournamentRosterChangeDto[];
    });
  }
}

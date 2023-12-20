import {Injectable, OnDestroy, signal, WritableSignal} from '@angular/core';
import {LoaderService} from '../loader.service';
import {PlayerResultDto} from '../DTOs/player-result-dto';
import {interval, Subscription} from 'rxjs';
import {AppStateService} from '../app-state.service';
import {AppTools} from '../../assets/app-tools';

@Injectable({
  providedIn: 'root'
})
export class LiveScoresService implements OnDestroy {
  // A player result represents a player playing a round in a division in a tournament
  // When on a small screen, a fan can be looking at exactly one of these in detail
  // The live scores service is responsible for updating it periodically.
  // The display component just wants to show the current value of the result
  // as it updates.  This shrieks Angular Signal so here it is...
  activeResultSig: WritableSignal<PlayerResultDto | null> = signal<PlayerResultDto | null>(null);

  // This is the id of the detailed result for a player in a round in a division
  // in a tournament that is being watched in an expansion panel.
  private _activeResultId: number | null = null;
  get activeResultId(): number | null {
    return this._activeResultId;
  }

  set activeResultId(value: number | null) {
    if (value !== this._activeResultId) {
      this._activeResultId = value;
      this.getActiveResults();
    }
  }

  // We watch the app state to see if we should be polling the server or not.
  appStateSubscription: Subscription;

  // We will poll the server to update the player result periodically.
  // keep track of this so we can unsubscribe later.
  pollingSubscription!: Subscription;

  constructor(
    private loaderService: LoaderService,
    private appStateService: AppStateService
  ) {
    this.appStateSubscription = this.appStateService.activeTool.subscribe((activeTool: string) => {
      if (activeTool !== AppTools.LIVE_SCORES.route) {
        this.stopPolling();
      }
    })
  }

  getActiveResults() {
    if (this.activeResultId) {
      this.loaderService.getScoreline(this.activeResultId).subscribe((playerResults) => {
        if (!playerResults) {
          this.activeResultSig.set(null);
        } else {
          this.activeResultSig.set(playerResults);
        }
      });
    } else {
      this.activeResultSig.set(null);
    }
  }

  startPolling() {
    this.stopPolling()
     this.getActiveResults();
      this.pollingSubscription = interval(5000).subscribe(() => {
        this.getActiveResults();
      });
    }

    stopPolling() {
      if (this.pollingSubscription) {
        this.pollingSubscription.unsubscribe();
      }
    }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
    if (this.appStateSubscription) {
      this.appStateSubscription.unsubscribe();
    }
  }
}

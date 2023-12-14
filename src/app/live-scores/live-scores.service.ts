import {Injectable, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {LoaderService} from '../loader.service';
import {PlayerResultDto} from '../DTOs/player-result-dto';
import {interval, lastValueFrom, Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';

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
      this.getActiveResults().then();
    }
  }

  // We will poll the server to update the player result periodically.
  // keep track of this so we can unsubscribe later.
  pollingSubscription: Subscription;

  constructor(
    private loaderService: LoaderService,
    private authService: AuthService,
  ) {
    this.pollingSubscription = interval(60000).subscribe(() => {
      if (this.authService.isAuthenticated() && this.activeResultId) {
        this.getActiveResults().then();
      }
    })
  }

  async getActiveResults() {
    if (this.activeResultId) {
      this.activeResultSig.set(await lastValueFrom(this.loaderService.getScoreline(this.activeResultId)));
    } else {
      this.activeResultSig.set(null);
    }
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}

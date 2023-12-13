import {Injectable, OnDestroy, signal, WritableSignal} from '@angular/core';
import {LoaderService} from '../loader.service';
import {PlayerResultDto} from '../DTOs/player-result-dto';
import {interval, lastValueFrom, Subscription} from 'rxjs';

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

  // This is the result the user is watching.
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
  ) {
    this.pollingSubscription = interval(2000).subscribe(() => {
      if (this.activeResultId) {
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

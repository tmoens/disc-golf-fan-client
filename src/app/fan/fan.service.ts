import {Injectable, OnDestroy, signal, WritableSignal} from '@angular/core';
import {LoaderService} from '../loader.service';
import {FanDto} from '../DTOs/fan-dto';
import {plainToInstance} from 'class-transformer';
import {BriefPlayerResultDto} from '../DTOs/brief-player-result-dto';
import {AuthService} from '../auth/auth.service';
import {interval, Subscription} from 'rxjs';
import {AppTools} from '../../assets/app-tools';
import {AppStateService} from '../app-state.service';

@Injectable({
  providedIn: 'root'
})
export class FanService implements OnDestroy {
  fan: FanDto | null = null;

  // When a fan is logged in, we grab the scores for the fan's favourites.
  // Then we poll the server for updates.
  // The component responsible for showing the scores just shows the latest info.
  // This is an Angular Signal that will hold scores we poll from the server.
  scoresSig: WritableSignal<BriefPlayerResultDto[]> = signal<BriefPlayerResultDto[]>([]);

  // We watch the app state to see if we should be polling the server or not.
  appStateSubscription: Subscription;

  // keep track of this so we can unsubscribe later.
  pollingSubscription!: Subscription;

  constructor(
    private appStateService: AppStateService,
    private authService: AuthService,
    private loaderService: LoaderService,
  ) {
    this.appStateSubscription = this.appStateService.activeTool.subscribe((activeTool: string) => {
      if (activeTool === AppTools.LIVE_SCORES.route) {
        this.loadFan();
        this.startPolling();
      } else {
        this.stopPolling();
      }
    })
  }

  startPolling() {
    this.stopPolling();
    this.getScores();
    this.pollingSubscription = interval(60000).subscribe(() => {
      this.getScores();
    });
  }

  stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadFan() {
    const fanId = this.authService.getAuthenticatedUserId();
    // if no one is logged in, there is no telling who we are supposed to load, so don't.
    if (!fanId) {
      this.fan = null;
      return
    }
    // if the logged in fan is the same as the fan who is loaded, do nothing,
    // otherwise load the logged in fan.
    if (!this.fan || this.fan.id !== fanId) {
      this.getFanById(fanId);
    }
  }

  getFanById(fanId: string) {
    this.loaderService.getFanById(fanId).subscribe((data) => {
      if (data) {
        this.fan = plainToInstance(FanDto, data);
        this.fan.sortFavourites();
      } else {
        this.fan = null;
      }
    })
  }

  getScores() {
    const fanId = this.authService.getAuthenticatedUserId()
    // it should probably never happen that this is called when no one is logged in...
    if (!fanId) {
      this.scoresSig.set([]);
      return;
    }
    this.loaderService.getScoresForFan(fanId).subscribe((data) => {
      if (!data) {
        this.scoresSig.set([]);
      } else {
        // we have data
        const scores: BriefPlayerResultDto[] = [];
        for (const datum of data) {
          scores.push(plainToInstance(BriefPlayerResultDto, datum));
        }
        this.scoresSig.set(scores)
      }
    });
  }

  fanHasFavorites(): boolean {
    if (this.fan) {
      return this.fan.favourites.length > 0;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    if (this.appStateSubscription) {
      this.appStateSubscription.unsubscribe();
    }
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}

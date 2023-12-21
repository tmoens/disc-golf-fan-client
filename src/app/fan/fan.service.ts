import {Injectable, OnDestroy, signal, WritableSignal} from '@angular/core';
import {LoaderService} from '../loader.service';
import {FanDto} from '../DTOs/fan-dto';
import {plainToInstance} from 'class-transformer';
import {BriefPlayerResultDto} from '../DTOs/brief-player-result-dto';
import {AuthService} from '../auth/auth.service';
import {interval, lastValueFrom, Subscription} from 'rxjs';
import {AppTools} from '../../assets/app-tools';
import {AppStateService} from '../app-state.service';
import {moveItemInArray} from '@angular/cdk/drag-drop';

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
        this.reload();
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

  reload() {
    const fanId = this.authService.getAuthenticatedUserId();
    // if no one is logged in, there is no telling who we are supposed to load, so don't.
    if (!fanId) {
      this.fan = null;
      return
    }
    this.loaderService.getFanById(fanId).subscribe((data) => {
      if (data) {
        this.fan = plainToInstance(FanDto, data);
        this.fan.sortFavourites();
      } else {
        this.fan = null;
      }
    })
    // when the fan is freshly loaded, better load scores.
    this.getScores();
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

  moveFavourite(fromIndex: number, toIndex:number) {
    if (!this.fan || fromIndex === toIndex) return;
    // make sure the move is in bounds
    if (fromIndex >= this.fan.favourites.length || toIndex >= this.fan.favourites.length) return;

    // move the favourite to the new position in the array
    moveItemInArray(this.fan.favourites, fromIndex, toIndex);

    // now renumber the favourites according to their new positions in the array
    this.reorderFavourites().then();
  }

  async reorderFavourites() {
    if (!this.fan) return;
    let index = -1;
    for (const f of this.fan.favourites) {
      index++;
      if (f.order !== index) {
        f.order = index;
        await lastValueFrom(this.loaderService.updateFavourite(f));
      }
    }
    this.reload();
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

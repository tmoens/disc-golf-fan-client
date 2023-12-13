import {effect, Injectable, OnDestroy, signal, WritableSignal} from '@angular/core';
import {LoaderService} from '../loader.service';
import {FanDto} from '../DTOs/fan-dto';
import {plainToInstance} from 'class-transformer';
import {BriefPlayerResultDto} from '../DTOs/brief-player-result-dto';
import {AuthService} from '../auth/auth.service';
import {interval, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FanService implements OnDestroy {
  fan: FanDto | undefined;

  // When a fan is logged in, we grab the scores for the fan's favourites.
  // Then we poll the server for updates.
  // The component responsible for showing the scores just shows the latest info.
  // This is an Angular Signal that will hold scores we poll from the server.
  scoresSig: WritableSignal<BriefPlayerResultDto[]> = signal<BriefPlayerResultDto[]>([]);

  // keep track of this so we can unsubscribe later.
  pollingSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
  ) {
    effect(() => {
      const userId = this.authService.authenticatedUserIdSig();
      if (userId) {
        this.getFanById(userId);
        this.getScores(userId);
      }
    });

    this.pollingSubscription = interval(6000).subscribe(() => {
      if (this.fan) {
        this.getScores(this.fan.id);
      }
    })
  }

  getFanById(fanId: string) {
    this.loaderService.getFanById(fanId).subscribe((data) => {
      if (data) {
        this.fan = plainToInstance(FanDto, data);
        this.fan.sortFavourites();
      } else {
        if (this.fan) {
          delete this.fan;
        }
      }
    })
  }

  reloadFan() {
    if (this.fan) {
      this.getFanById(this.fan.id);
    }
  }

  getScores(fanId: string) {
    if (fanId)
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

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}

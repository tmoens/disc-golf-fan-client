import { Injectable } from '@angular/core';
import {LoaderService} from '../loader.service';
import {FanDto} from '../DTOs/fan-dto';
import {plainToInstance} from 'class-transformer';
import {BriefPlayerResultDto} from '../DTOs/brief-player-result-dto';

@Injectable({
  providedIn: 'root'
})
export class FanService {
  fan: FanDto | undefined;
  scores: BriefPlayerResultDto[] | undefined;


  constructor(

    private loaderService: LoaderService,
  ) {
  }

  getFanById(fanId: number) {
    this.loaderService.getFanById(fanId).subscribe((data) => {
      if (data) {
        this.fan = plainToInstance(FanDto, data);
        this.fan.sortFavourites();
        this.getScores();
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

  getScores() {
    if (this.fan)
    this.loaderService.getScoresForFan(this.fan.id).subscribe((data) => {
      if (!data) {
        if (this.scores) {
          delete this.scores;
        }
        return;
      }
      // we have data
      this.scores = [];
      for (const datum of data) {
        this.scores.push(plainToInstance(BriefPlayerResultDto, datum));
      }
    });
  }
}

import {Component, effect, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SmallScreenHoleScoreComponent} from '../small-screen-hole-score/small-screen-hole-score.component';
import {LiveScoresService} from '../live-scores.service';
import {SmallScreenScorelineComponent} from '../small-screen-scoreline/small-screen-scoreline.component';
import {GolfScoreComponent} from '../golf-score/golf-score.component';
import {MatListModule} from '@angular/material/list';
import {BriefPlayerResultDto} from '../../DTOs/brief-player-result.dto';

@Component({
  selector: 'app-small-screen-score-details',
  standalone: true,
  imports: [CommonModule, SmallScreenHoleScoreComponent, SmallScreenScorelineComponent, GolfScoreComponent, MatListModule],
  templateUrl: './small-screen-score-details.component.html',
  styleUrl: './small-screen-score-details.component.scss'
})
export class SmallScreenScoreDetails {
  @Input() briefPlayerResult!: BriefPlayerResultDto;

  constructor(
    protected liveScoreService: LiveScoresService,
  ) {
  }
}

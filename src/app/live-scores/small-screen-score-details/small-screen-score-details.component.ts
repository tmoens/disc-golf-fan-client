import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmallScreenHoleScoreComponent} from '../small-screen-hole-score/small-screen-hole-score.component';
import {LiveScoresService} from '../live-scores.service';
import {GolfScoreComponent} from '../golf-score/golf-score.component';
import {MatListModule} from '@angular/material/list';
import {BriefPlayerResultDto} from '../brief-player-result.dto';

@Component({
  selector: 'app-small-screen-score-details',
  standalone: true,
  imports: [CommonModule, SmallScreenHoleScoreComponent, GolfScoreComponent, MatListModule],
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

import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BriefPlayerResultDto} from '../../DTOs/brief-player-result-dto';
import {PlayerResultDto} from '../../DTOs/player-result-dto';
import {GolfScoreComponent} from '../golf-score/golf-score.component';

@Component({
  selector: 'app-small-screen-scoreline',
  standalone: true,
  imports: [CommonModule, GolfScoreComponent],
  templateUrl: './small-screen-scoreline.component.html',
  styleUrl: './small-screen-scoreline.component.scss'
})
export class SmallScreenScorelineComponent {
  @Input() scoreline!: BriefPlayerResultDto | PlayerResultDto;
}

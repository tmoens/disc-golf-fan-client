import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {PlayerResultDto} from '../DTOs/player-result-dto';

@Component({
  selector: 'app-scoreline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scoreline.component.html',
  styleUrl: './scoreline.component.scss'
})
export class ScorelineComponent {
  @Input() scoreline!: PlayerResultDto;
}

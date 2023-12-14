import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-golf-score',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './golf-score.component.html',
  styleUrl: './golf-score.component.scss'
})
export class GolfScoreComponent {
  @Input() score!: number;
}

import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { UpcomingTournamentsDto } from '../../upcoming-tournaments.dto';

@Component({
  standalone: true,
  selector: 'dgf-player-tournaments',
  imports: [
    MatIcon,
  ],
  templateUrl: './player-tournaments.component.html',
  styleUrl: './player-tournaments.component.scss'
})
export class PlayerTournamentsComponent {
  @Input() player!: UpcomingTournamentsDto;

}

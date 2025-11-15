import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoaderService} from '../loader.service';
import {UpcomingTournamentsDto} from './upcoming-tournaments.dto';
import {lastValueFrom} from 'rxjs';
import {MatCardModule} from '@angular/material/card';
import {AppTools} from '../shared/app-tools';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ToolbarComponent} from '../toolbar/toolbar.component';

@Component({
    selector: 'app-upcoming-tournaments',
    imports: [CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatTooltipModule,
        ToolbarComponent,
    ],
    templateUrl: './upcoming-tournaments.component.html',
    styleUrl: './upcoming-tournaments.component.scss'
})
export class UpcomingTournamentsComponent implements OnInit {
  upcomingTournaments: UpcomingTournamentsDto[] = [];

  constructor(
    private loaderService: LoaderService,
    private router: Router,
  ) {
  }

  async ngOnInit() {
    const results = await lastValueFrom(this.loaderService.getUpcomingEvents());
    if (!results) {
      this.upcomingTournaments = [];
    } else {
      this.upcomingTournaments = results;
    }
  }

  onManageFavourites() {
    void this.router.navigate([AppTools.MANAGE_FAVOURITES.route]);
  }

  protected readonly AppTools = AppTools;
}

import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import { DgfActionRowComponent } from '../app-helpers/action-row.component';
import { DgfComponentContainerComponent } from '../dgf-component-container/dgf-component-container.component';
import { FanService } from '../fan/fan.service';
import {LoaderService} from '../loader.service';
import { DGF_TOOL_ROUTES } from '../tools/dgf-tool-routes';
import { PlayerTournamentsComponent } from './player-tournaments/player-tournaments/player-tournaments.component';
import {UpcomingTournamentsDto} from './upcoming-tournaments.dto';
import {lastValueFrom} from 'rxjs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DgfTool} from '../tools/dgf-tool';
import {DgfToolsService} from '../tools/dgf-tools.service';
import {DGF_TOOL_KEY} from '../tools/dgf-took-keys';

@Component({
  selector: 'app-upcoming-tournaments',
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule, PlayerTournamentsComponent, DgfComponentContainerComponent, DgfActionRowComponent,
  ],
  templateUrl: './upcoming-tournaments.component.html',
  styleUrl: './upcoming-tournaments.component.scss'
})
export class UpcomingTournamentsComponent implements OnInit {
  upcomingTournaments: UpcomingTournamentsDto[] = [];
  manageFavouritesTool: DgfTool | undefined;

  constructor(
    private fanService: FanService,
    private loaderService: LoaderService,
    private toolService: DgfToolsService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.manageFavouritesTool = this.toolService.getByKey(DGF_TOOL_KEY.MANAGE_FAVOURITES);
    const fan = this.fanService.fanSignal();
    if (!fan) return;
    const results = await lastValueFrom(this.loaderService.getUpcomingEvents(fan.id));
    if (!results) {
      this.upcomingTournaments = [];
    } else {
      this.upcomingTournaments = results;
    }
  }

  onManageFavourites() {
    this.router.navigate([DGF_TOOL_ROUTES.MANAGE_FAVOURITES]);
  }
}

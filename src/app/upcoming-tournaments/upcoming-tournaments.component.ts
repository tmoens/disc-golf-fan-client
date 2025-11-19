import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoaderService} from '../loader.service';
import {UpcomingTournamentsDto} from './upcoming-tournaments.dto';
import {lastValueFrom} from 'rxjs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ToolbarComponent} from '../toolbar/toolbar.component';
import {DgfTool} from '../tools/dgf-tool';
import {DgfToolsService} from '../tools/dgf-tools.service';
import {DGF_TOOL_KEY} from '../tools/dgf-took-keys';
import {AppStateService} from '../app-state.service';

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
  manageFavouritesTool: DgfTool | undefined;

  constructor(
    private loaderService: LoaderService,
    private toolService: DgfToolsService,
    private appStateService: AppStateService,
  ) {
  }

  async ngOnInit() {
    this.manageFavouritesTool = this.toolService.getByKey(DGF_TOOL_KEY.MANAGE_FAVOURITES);
    const results = await lastValueFrom(this.loaderService.getUpcomingEvents());
    if (!results) {
      this.upcomingTournaments = [];
    } else {
      this.upcomingTournaments = results;
    }
  }

  onManageFavourites() {
    this.appStateService.activateTool(DGF_TOOL_KEY.MANAGE_FAVOURITES);
  }
}

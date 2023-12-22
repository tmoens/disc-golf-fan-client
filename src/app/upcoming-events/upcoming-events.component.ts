import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoaderService} from '../loader.service';
import {UpcomingEventsDto} from '../DTOs/upcoming-events.dto';
import {lastValueFrom} from 'rxjs';
import {MatCardModule} from '@angular/material/card';
import {AppTools} from '../../assets/app-tools';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MainMenuComponent} from '../main-menu/main-menu.component';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MainMenuComponent, MatIconModule, MatToolbarModule, MatTooltipModule],
  templateUrl: './upcoming-events.component.html',
  styleUrl: './upcoming-events.component.scss'
})
export class UpcomingEventsComponent implements OnInit {
  upcommingEvents: UpcomingEventsDto[] = [];
  constructor(
    private loaderService: LoaderService,
    private router: Router,
  ) {
  }

  async ngOnInit() {
    const results = await lastValueFrom(this.loaderService.getUpcomingEvents());
    if (!results) {
      this.upcommingEvents = [];
    } else {
      this.upcommingEvents = results;
    }
  }
  onManageFavourites() {
    this.router.navigate([AppTools.MANAGE_FAVOURITES.route]).then();
  }

  protected readonly AppTools = AppTools;
}

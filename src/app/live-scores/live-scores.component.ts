import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FanService} from '../fan/fan.service';
import {MatCardModule} from '@angular/material/card';
import {MainMenuComponent} from '../main-menu/main-menu.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {Router} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {SmallScreenScoreDetails} from './small-screen-score-details/small-screen-score-details.component';
import {LiveScoresService} from './live-scores.service';
import {MatButtonModule} from '@angular/material/button';
import {SmallScreenScorelineComponent} from './small-screen-scoreline/small-screen-scoreline.component';

@Component({
  selector: 'app-live-scores',
  standalone: true,
  imports: [CommonModule, MatCardModule, MainMenuComponent, MatToolbarModule, MatExpansionModule, SmallScreenScoreDetails, MatButtonModule, SmallScreenScorelineComponent],
  templateUrl: './live-scores.component.html',
  styleUrl: './live-scores.component.scss'
})
export class LiveScoresComponent implements OnInit {
  constructor(
    protected fanService: FanService,
    protected liveScoreService: LiveScoresService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    if (this.fanService.fan && this.fanService.fan.favourites.length < 1) {
      this.router.navigate(['/manage-favourites']).then();
    } else {
      this.fanService.getScores();
    }
  }

  isExpanded(resultId: number): boolean {
    return this.liveScoreService.activeResultId === resultId;
  }

  onManageFavourites() {
    this.router.navigate(['/manage-favourites']).then();
  }
  async openPanel(resultId: number) {
    // Opening one panel automatically closes any other open panel
    // So both (opened) and (closed) are fired.
    // BUT when a new panel is opened, and if (opened) fires first, then closed fires,
    // the effect is that the newly opened panel will close.  So...
    // Wait a tick for Close to fire first.
    await new Promise((resolve) => setTimeout(resolve, 1));
    this.liveScoreService.activeResultId = resultId;
  }

  closePanel() {
    this.liveScoreService.activeResultId = null;
  }
}

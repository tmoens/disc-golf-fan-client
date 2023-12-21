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
import {MatDialog} from '@angular/material/dialog';
import {AddFavouriteDialogComponent} from '../fan/add-favourite-dialog/add-favourite-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {BriefPlayerResultDto} from '../DTOs/brief-player-result-dto';

@Component({
  selector: 'app-live-scores',
  standalone: true,
  imports: [CommonModule, MatCardModule, MainMenuComponent, MatToolbarModule, MatExpansionModule, SmallScreenScoreDetails, MatButtonModule, SmallScreenScorelineComponent, MatIconModule, MatTooltipModule, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './live-scores.component.html',
  styleUrl: './live-scores.component.scss'
})
export class LiveScoresComponent implements OnInit {
  constructor(
    protected fanService: FanService,
    protected liveScoreService: LiveScoresService,
    private router: Router,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    if (this.fanService.fan && this.fanService.fan.favourites.length < 1) {
      this.router.navigate(['/manage-favourites']).then();
    } else {
      this.fanService.getScores();
    }
  }

  openAddFavouriteDialog(): void {
    const dialogRef = this.dialog.open(AddFavouriteDialogComponent, {
      width: '350px',
      position: { top: '100px' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
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
    this.liveScoreService.startPolling();
  }

  closePanel() {
    this.liveScoreService.stopPolling();
    this.liveScoreService.activeResultId = null;
  }

  onDrop(event: CdkDragDrop<BriefPlayerResultDto[]>) {
    // Things get a little wonky here.
    // We are looking at a list of scorelines, so the drag-drop list gives us
    // the indexes within that list. And the scorelines are presented in the fan's
    // specified order of players, so, you would think the n'th scoreline
    // corresponds to the n'th player.  Alas, no.  A player can show up in
    // multiple tournaments.  Which throws the numbering off. So we have to
    // play a little mucky-maulers to convert a reordering of a score list
    // to a reordering of the fan's favourites.
    const scorelineFromIndex = event.previousIndex;
    const scorelineToIndex = event.currentIndex;
    let favouriteFromIndex = -1;
    let favouriteToIndex = -1;

    // zip through the scorelines noting when you meet duplicates
    let dups = 0;
    let index = -1;
    let lastPlayerIdMet = 0;
    for (const scoreline of this.fanService.scoresSig()) {
      index++;
      if (lastPlayerIdMet === scoreline.pdgaNum) {
        dups++;
      } else {
        lastPlayerIdMet = scoreline.pdgaNum;
      }
      if (scorelineFromIndex === index) favouriteFromIndex = index - dups;
      if (scorelineToIndex === index) favouriteToIndex = index - dups;
      if (favouriteToIndex >=0 && favouriteFromIndex >= 0) break;
    }
    this.fanService.moveFavourite(favouriteFromIndex, favouriteToIndex);
  }
}

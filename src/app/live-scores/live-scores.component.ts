import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import {FanService} from '../fan/fan.service';
import {MatCardModule} from '@angular/material/card';
import {MainMenuComponent} from '../main-menu/main-menu.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {Router} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import { AppTools } from '../shared/app-tools';
import {SmallScreenScoreDetails} from './small-screen-score-details/small-screen-score-details.component';
import {LiveScoresService} from './live-scores.service';
import {MatButtonModule} from '@angular/material/button';
import {SmallScreenScorelineComponent} from './small-screen-scoreline/small-screen-scoreline.component';
import {MatDialog} from '@angular/material/dialog';
import {AddFavouriteDialogComponent} from '../fan/add-favourite-dialog/add-favourite-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {ReorderFavouriteDto} from '../DTOs/reorder-favourite.dto';
import {BriefPlayerResultDto} from '../DTOs/brief-player-result.dto';

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

  async ngOnInit() {
    if (!this.fanService.fan) {
      await this.fanService.reload();
    }
    if (this.fanService.fan && this.fanService.fan.favourites.length < 1) {
      void this.router.navigate([`/${AppTools.MANAGE_FAVOURITES.route}`]);
    } else {
      this.liveScoreService.loadFavouritesLiveScores();
    }
  }

  async openAddFavouriteDialog(): Promise<void> {
    const dialogRef = this.dialog.open(AddFavouriteDialogComponent, {
      width: '350px',
      position: { top: '100px' },
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
    }
  }

  isExpanded(briefPlayerResultDto: BriefPlayerResultDto): boolean {
    return this.liveScoreService.isInFocus(briefPlayerResultDto);
  }

  onManageFavourites() {
    void this.router.navigate([`/${AppTools.MANAGE_FAVOURITES.route}`]);
  }

  async openPanel(briefPlayerResult: BriefPlayerResultDto) {
    // Opening one panel automatically closes any other open panel.
    // So both (opened) and (closed) are fired.
    // BUT when a new panel is opened, and if (opened) fires first, then closed fires,
    // the effect is that the newly opened panel will close.  So...
    // Wait a tick for Close to fire first.
    await new Promise((resolve) => setTimeout(resolve, 1));
    this.liveScoreService.setDetailFocus(briefPlayerResult);
  }

  closePanel() {
    this.liveScoreService.unsetDetailFocus();
  }

  async onDrop(event: CdkDragDrop<any>) {
    // translate the drag from index to a player
    const playerIdToBeMoved = this.liveScoreService.favouriteLiveScores()[event.previousIndex]?.pdgaNum || 0;
    // translate the drop target to the player before or after which the playerToBeMoved was dropped
    const playerIdTarget = this.liveScoreService.favouriteLiveScores()[event.currentIndex]?.pdgaNum || 0;

    if (this.fanService.fan && playerIdTarget && playerIdToBeMoved) {
      const reorderFavouriteDto =
        new ReorderFavouriteDto(this.fanService.fan.id, playerIdToBeMoved, playerIdTarget);
      if (event.previousIndex < event.currentIndex) {
        await this.fanService.moveFavouriteAfter(reorderFavouriteDto);
        this.liveScoreService.loadFavouritesLiveScores();
      }
      if (event.previousIndex > event.currentIndex) {
        await this.fanService.moveFavouriteBefore(reorderFavouriteDto);
        this.liveScoreService.loadFavouritesLiveScores();
      }
    }
  }

  protected readonly AppTools = AppTools;
}

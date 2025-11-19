import {Component, effect, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FanService} from '../fan/fan.service';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {ToolbarComponent} from '../toolbar/toolbar.component';
import {SmallScreenScoreDetails} from './small-screen-score-details/small-screen-score-details.component';
import {LiveScoresService} from './live-scores.service';
import {MatButtonModule} from '@angular/material/button';
import {SmallScreenScorelineComponent} from './small-screen-scoreline/small-screen-scoreline.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {BriefPlayerResultDto} from './brief-player-result.dto';
import {DgfToolsService} from '../tools/dgf-tools.service';
import {DgfTool} from '../tools/dgf-tool';
import {AppStateService} from '../app-state.service';
import {DGF_TOOL_KEY} from '../tools/dgf-took-keys';

@Component({
  selector: 'app-live-scores',
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatExpansionModule,
    SmallScreenScoreDetails,
    MatButtonModule,
    SmallScreenScorelineComponent,
    MatIconModule,
    MatTooltipModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    ToolbarComponent,
  ],
  templateUrl: './live-scores.component.html',
  styleUrl: './live-scores.component.scss'
})

export class LiveScoresComponent implements OnInit {
  manageFavouritesTool?: DgfTool;

  constructor(
    protected fanService: FanService,
    protected liveScoreService: LiveScoresService,
    private toolsService: DgfToolsService,
    private appState: AppStateService,
  ) {
    effect(() => {
      const fan = this.fanService.fanSignal();

      // still logging in? still loading? do nothing
      if (!fan) return;

      // no favourites yet? → redirect
      if (fan.favourites.length === 0) {
        appState.activateTool(DGF_TOOL_KEY.MANAGE_FAVOURITES);
        return;
      }
    });
  }

  ngOnInit() {
    this.manageFavouritesTool = this.toolsService.getByKey(DGF_TOOL_KEY.MANAGE_FAVOURITES);
  }

  isExpanded(briefPlayerResultDto: BriefPlayerResultDto): boolean {
    return this.liveScoreService.isInFocus(briefPlayerResultDto);
  }

  onManageFavourites() {
    this.appState.activateTool(DGF_TOOL_KEY.MANAGE_FAVOURITES);
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

  onDrop(event: CdkDragDrop<any>) {
    this.fanService.moveFavourite(event.previousIndex, event.currentIndex);
  }
}

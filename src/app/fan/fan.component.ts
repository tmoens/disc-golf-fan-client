import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DgfActionRowComponent } from '../app-helpers/action-row.component';
import { AppStateService } from '../app-state.service';
import { DgfComponentContainerComponent } from '../dgf-component-container/dgf-component-container.component';
import { AddFavouriteBottomSheetComponent } from './add-favourite/add-favourite/add-favourite-bottomsheet.component';
import { AddFavouriteDialogComponent } from './add-favourite/add-favourite/add-favourite-dialog.component';
import { FavouriteEditorBottomSheetComponent } from './edit-favourite/favourite-editor-bottom-sheet.component';
import { FavouriteEditorDialogComponent } from './edit-favourite/favourite-editor-dialog.component';
import {FavouriteDto} from './dtos/favourite.dto';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {FanService} from './fan.service';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-fan',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    DgfComponentContainerComponent,
    DgfActionRowComponent,
  ],
  templateUrl: './fan.component.html',
  styleUrl: './fan.component.scss'
})
export class FanComponent {
  constructor(
    private appState: AppStateService,
    protected fanService: FanService,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
  ) {}


  addFavourite() {
    if (this.appState.screenInfo().isSmall) {
      // → Open as bottom sheet
      this.bottomSheet.open(AddFavouriteBottomSheetComponent, {
        // You can tune these later.
        // Leave it minimal for now.
        disableClose: false,
      });

    } else {
      // → Standard dialog for tablets/desktops
      this.dialog.open(AddFavouriteDialogComponent, {
        width: '500px',
      });
    }
  }

  editFavourite(favourite: FavouriteDto) {
    if (this.appState.screenInfo().isSmall) {
      // → Open as bottom sheet
      this.bottomSheet.open(FavouriteEditorBottomSheetComponent, {
        // You can tune these later.
        // Leave it minimal for now.
        disableClose: false,
        data: { favourite },
      });

    } else {
      // → Standard dialog for tablets/desktops
      this.dialog.open(FavouriteEditorDialogComponent, {
        width: '500px',
        data: { favourite },
      });
    }
  }


  deleteFavourite(favourite: FavouriteDto) {
    this.fanService.deleteFavourite(favourite).subscribe();
  }

  onDrop(event: CdkDragDrop<FavouriteDto[]>) {
    const fan = this.fanService.fanSignal();
    if (!fan) return;

    const fromIndex = event.previousIndex;
    const toIndex   = event.currentIndex;

    // No movement? Bail.
    if (fromIndex === toIndex) return;

    const favourites = fan.favourites;

    const moved = favourites[fromIndex];
    const target = favourites[toIndex];

    if (!moved || !target) return;

    const direction = fromIndex < toIndex ? 'after' : 'before';

    this.fanService
      .moveFavourite(
        moved.playerId,
        target.playerId,
        direction
      )
      .subscribe();
  }
}

import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DgfActionRowComponent } from '../app-helpers/action-row.component';
import { DgfComponentContainerComponent } from '../dgf-component-container/dgf-component-container.component';
import { AddFavouriteComponent } from './add-favourite/add-favourite/add-favourite.component';
import { FavouriteEditorComponent } from './edit-favourite/favourite-editor.component';
import {FavouriteDto} from './dtos/favourite.dto';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {FanService} from './fan.service';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
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
    protected fanService: FanService,
    private dialog: MatDialog,
  ) {}


  addFavourite() {
    this.dialog.open(AddFavouriteComponent, {
      width: '500px'
    });
  }

  editFavourite(favourite: FavouriteDto) {
    this.dialog.open(FavouriteEditorComponent, {
      data: {favourite},
      width: '400px'
    });
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

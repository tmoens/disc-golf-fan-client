import {Component} from '@angular/core';
import {FavouriteDto} from './dtos/favourite.dto';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {FanService} from './fan.service';
import {MatCardModule} from '@angular/material/card';
import {ToolbarComponent} from '../toolbar/toolbar.component';
import {FavouriteEditorComponent} from '../favourite/favourite-editor.component';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-fan',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    ToolbarComponent,
    FavouriteEditorComponent,
  ],
  templateUrl: './fan.component.html',
  styleUrl: './fan.component.scss'
})
export class FanComponent {
  selectedFavourite: FavouriteDto | undefined = undefined;

  constructor(
    protected fanService: FanService,
  ) {
  }

  editFavourite(favourite: FavouriteDto) {
    this.selectedFavourite = favourite;
  }

  deleteFavourite(favourite: FavouriteDto) {
    this.fanService.deleteFavourite(favourite).subscribe();
  }

  onDrop(event: CdkDragDrop<FavouriteDto[]>) {
    this.fanService.moveFavourite(event.previousIndex, event.currentIndex);
  }
}

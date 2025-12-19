import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AddFavouriteComponent } from './add-favourite.component';
import { FavouriteDto } from '../../dtos/favourite.dto';

@Component({
  standalone: true,
  selector: 'app-add-favourite-dialog',
  template: `
    <app-add-favourite
      (saveRequest)="handleSave($event)"
      (cancelRequest)="handleCancel()">
    </app-add-favourite>
  `,
  imports: [AddFavouriteComponent]
})
export class AddFavouriteDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<AddFavouriteDialogComponent>,
  ) {}

  handleSave(fav: FavouriteDto) {
    this.dialogRef.close(fav);
  }

  handleCancel() {
    this.dialogRef.close();
  }
}

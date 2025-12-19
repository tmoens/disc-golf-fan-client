import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FavouriteDto } from '../dtos/favourite.dto';
import { FavouriteEditorComponent } from './favourite-editor.component';

@Component({
  standalone: true,
  selector: 'dgf-favourite-editor-dialog',
  imports: [FavouriteEditorComponent],
  template: `
    <dgf-favourite-editor
      [favourite]="data.favourite"
      (saveRequest)="onSave($event)"
      (cancelRequest)="onCancel()"
    ></dgf-favourite-editor>
  `
})
export class FavouriteEditorDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<FavouriteEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { favourite: FavouriteDto }
  ) {}

  onSave(updated: FavouriteDto) {
    this.dialogRef.close(updated);
  }

  onCancel() {
    this.dialogRef.close();
  }
}

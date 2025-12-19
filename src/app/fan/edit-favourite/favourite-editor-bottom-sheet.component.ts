import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FavouriteDto } from '../dtos/favourite.dto';
import { FavouriteEditorComponent } from './favourite-editor.component';

@Component({
  standalone: true,
  selector: 'dgf-favourite-editor-sheet',
  imports: [FavouriteEditorComponent],
  template: `
    <dgf-favourite-editor
      [favourite]="data.favourite"
      (saveRequest)="onSave($event)"
      (cancelRequest)="onCancel()"
    ></dgf-favourite-editor>
  `
})
export class FavouriteEditorBottomSheetComponent {

  constructor(
    private sheetRef: MatBottomSheetRef<FavouriteEditorBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { favourite: FavouriteDto }
  ) {}

  onSave(updated: FavouriteDto) {
    this.sheetRef.dismiss(updated);
  }

  onCancel() {
    this.sheetRef.dismiss();
  }
}

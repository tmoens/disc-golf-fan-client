import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AddFavouriteComponent } from './add-favourite.component';

@Component({
  standalone: true,
  selector: 'app-add-favourite-sheet',
  imports: [AddFavouriteComponent],
  template: `
    <app-add-favourite
      (saveRequest)="onSave($event)"
      (cancelRequest)="onCancel()">
    </app-add-favourite>
  `,
})
export class AddFavouriteBottomSheetComponent {
  constructor(
    private readonly sheetRef: MatBottomSheetRef<AddFavouriteBottomSheetComponent>
  ) {}

  onSave(dto: unknown) {
    this.sheetRef.dismiss(dto);
  }

  onCancel() {
    this.sheetRef.dismiss(null);
  }
}

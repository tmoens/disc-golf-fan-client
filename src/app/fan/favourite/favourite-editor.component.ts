import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FavouriteDto} from '../../DTOs/favourite-dto';

@Component({
  selector: 'app-favourite-editor',
  templateUrl: './favourite-editor.component.html',
  styleUrl: './favourite-editor.component.scss'
})
export class FavouriteEditorComponent {
  @Input() favourite!: FavouriteDto;
  @Output() deleteFavourite = new EventEmitter<FavouriteDto>();

  remove() {
    this.deleteFavourite.emit(this.favourite)
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FanComponent} from './fan/fan.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {ScorelineComponent} from '../scoreline/scoreline.component';
import {FavouriteEditorComponent} from './favourite/favourite-editor.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    FanComponent,
    FavouriteEditorComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatListModule,
    ScorelineComponent,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    FanComponent,
    FavouriteEditorComponent,
  ]
})
export class FanModule { }

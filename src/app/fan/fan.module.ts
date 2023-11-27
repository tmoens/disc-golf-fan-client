import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FanComponent} from './fan.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {ScorelineComponent} from '../scoreline/scoreline.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {CdkDrag, CdkDragHandle, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {MatCardModule} from '@angular/material/card';
import {MatLineModule} from '@angular/material/core';

@NgModule({
  declarations: [
    FanComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatListModule,
    ScorelineComponent,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    CdkDropListGroup,
    MatCardModule,
    CdkDrag,
    FormsModule,
    CdkDropList,
    MatLineModule,
    CdkDragHandle,
  ],
  exports: [
    FanComponent,
  ]
})
export class FanModule { }

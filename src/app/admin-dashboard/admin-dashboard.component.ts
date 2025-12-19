import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import { DgfComponentContainerComponent } from '../dgf-component-container/dgf-component-container.component';
import { VersionService } from '../version.service';
import {MatListModule} from '@angular/material/list';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatExpansionModule,
    MatListModule,
    DgfComponentContainerComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  constructor(
    protected versionService: VersionService,
  ) {}
}

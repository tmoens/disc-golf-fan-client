import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { Router } from '@angular/router';
import {AuthService} from '../auth/auth.service';
import { DgfComponentContainerComponent } from '../dgf-component-container/dgf-component-container.component';
import {DGF_TOOL_KEY} from '../tools/dgf-took-keys';
import { DgfTool } from '../tools/dgf-tool';
import { DGF_TOOL_ROUTES } from '../tools/dgf-tool-routes';
import { DgfToolsService } from '../tools/dgf-tools.service';

@Component({
  standalone: true,
  selector: 'app-welcome-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    DgfComponentContainerComponent,
  ],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {
  protected registrationTool: DgfTool;

  constructor(
    protected authService: AuthService,
    private router: Router,
    private toolService: DgfToolsService,
  ) {
    this.registrationTool = this.toolService.getByKey(DGF_TOOL_KEY.REGISTER);
  }

  register() {
    void this.router.navigate([DGF_TOOL_ROUTES.REGISTER]);
  }
  login() {
    void this.router.navigate([DGF_TOOL_ROUTES.LOGIN]);
  }
  logout() {
    void this.router.navigate([DGF_TOOL_ROUTES.LOGOUT]);
  }
}

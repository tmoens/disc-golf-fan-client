import {inject, NgModule, provideAppInitializer} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {UnauthorizedInterceptor} from './auth/unauthorized-interceptor';
import {AppStateService} from './app-state.service';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {MainMenuComponent} from './main-menu/main-menu.component';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';

// Function to initialize AppState
export function initializeApp(appStateService: AppStateService) {
  return (): Promise<any> => {
    return appStateService.initializeAppState();
  };
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent], imports: [BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule, ToolbarComponent, MainMenuComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    provideAppInitializer(() => {
      const initializerFn = (initializeApp)(inject(AppStateService));
      return initializerFn();
    }),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {floatLabel: 'always', appearance: 'fill'}
    },
  ]
})
export class AppModule {
}

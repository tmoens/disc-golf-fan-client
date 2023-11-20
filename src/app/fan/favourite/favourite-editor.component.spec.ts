import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteEditorComponent } from './favourite-editor.component';

describe('FavoriteComponent', () => {
  let component: FavouriteEditorComponent;
  let fixture: ComponentFixture<FavouriteEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouriteEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavouriteEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

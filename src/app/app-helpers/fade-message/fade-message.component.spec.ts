import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FadeMessageComponent } from './fade-message.component';

describe('FadeMessageComponent', () => {
  let component: FadeMessageComponent;
  let fixture: ComponentFixture<FadeMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FadeMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FadeMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

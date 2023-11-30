import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorelineComponent } from './scoreline.component';

describe('ScorelineComponent', () => {
  let component: ScorelineComponent;
  let fixture: ComponentFixture<ScorelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScorelineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScorelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

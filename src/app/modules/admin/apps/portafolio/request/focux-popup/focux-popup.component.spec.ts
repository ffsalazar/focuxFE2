import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocuxPopupComponent } from './focux-popup.component';

describe('FocuxPopupComponent', () => {
  let component: FocuxPopupComponent;
  let fixture: ComponentFixture<FocuxPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FocuxPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FocuxPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

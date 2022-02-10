import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStepOneComponent } from './request-step-one.component';

describe('RequestStepOneComponent', () => {
  let component: RequestStepOneComponent;
  let fixture: ComponentFixture<RequestStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestStepOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

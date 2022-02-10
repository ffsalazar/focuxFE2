import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStepTwoComponent } from './request-step-two.component';

describe('RequestStepTwoComponent', () => {
  let component: RequestStepTwoComponent;
  let fixture: ComponentFixture<RequestStepTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestStepTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

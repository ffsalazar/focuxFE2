import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStepThirdComponent } from './request-step-third.component';

describe('RequestStepThirdComponent', () => {
  let component: RequestStepThirdComponent;
  let fixture: ComponentFixture<RequestStepThirdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestStepThirdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestStepThirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

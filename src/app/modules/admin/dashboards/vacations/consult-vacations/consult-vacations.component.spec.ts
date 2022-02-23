import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultVacationsComponent } from './consult-vacations.component';

describe('ConsultVacationsComponent', () => {
  let component: ConsultVacationsComponent;
  let fixture: ComponentFixture<ConsultVacationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultVacationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultVacationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

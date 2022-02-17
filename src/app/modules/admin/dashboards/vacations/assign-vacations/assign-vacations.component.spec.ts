import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVacationsComponent } from './assign-vacations.component';

describe('AssignVacationsComponent', () => {
  let component: AssignVacationsComponent;
  let fixture: ComponentFixture<AssignVacationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignVacationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignVacationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

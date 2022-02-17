import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentOccupationComponent } from './assignment-occupation.component';

describe('AssignmentOccupationComponent', () => {
  let component: AssignmentOccupationComponent;
  let fixture: ComponentFixture<AssignmentOccupationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentOccupationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentOccupationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

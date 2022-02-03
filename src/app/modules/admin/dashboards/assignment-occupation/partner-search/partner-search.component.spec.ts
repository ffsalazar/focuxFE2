import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerSearchComponent } from './partner-search.component';

describe('PartnerSearchComponent', () => {
  let component: PartnerSearchComponent;
  let fixture: ComponentFixture<PartnerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

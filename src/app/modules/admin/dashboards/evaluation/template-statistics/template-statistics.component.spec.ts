import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateStatisticsComponent } from './template-statistics.component';

describe('TemplateStatisticsComponent', () => {
  let component: TemplateStatisticsComponent;
  let fixture: ComponentFixture<TemplateStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

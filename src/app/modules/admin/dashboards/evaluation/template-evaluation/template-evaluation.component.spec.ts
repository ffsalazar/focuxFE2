import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateEvaluationComponent } from './template-evaluation.component';

describe('TemplateEvaluationComponent', () => {
  let component: TemplateEvaluationComponent;
  let fixture: ComponentFixture<TemplateEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateEvaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

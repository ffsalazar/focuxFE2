import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Department } from '../evaluation.types';
import { EvaluationService } from '../evaluation.service';
import { Objetive } from '../../../masters/objetives/objetives.types';
import { ObjetivesService } from '../../../masters/objetives/objetives.service';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { Indicator } from 'app/modules/admin/masters/indicators/indicators.types';

@Component({
  selector: 'app-template-evaluation',
  templateUrl: './template-evaluation.component.html',
  styleUrls: ['./template-evaluation.component.scss']
})
export class TemplateEvaluationComponent implements OnInit {
  departments$: Observable<Department[]>;
  objetives$: Observable<Objetive[]>;
  indicators$: Observable<Indicator[]>;
  objetivesCount: number = 0;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  periods: any[] = [
    {
      id: 1,
      dateInit: 'Enero',
      dateEnd: 'Marzo'
    },
    {
      id: 2,
      dateInit: 'Abril',
      dateEnd: 'Junio'
    },
    {
      id: 3,
      dateInit: 'Julio',
      dateEnd: 'Septiembre'
    },
    {
      id: 4,
      dateInit: 'Octubre',
      dateEnd: 'Diciembre'
    },

  ];
  months: any[] = [
    {
      id: 1,
      dateInit: 'Enero'
    },
    {
      id: 2,
      dateInit: 'Febrero'
    },
    {
      id: 3,
      dateInit: 'Marzo'

    },
    {
      id: 4,
      dateInit: 'Abril'
    },
    {
      id: 5,
      dateInit: 'Mayo'
    },
    {
      id: 6,
      dateInit: 'Junio'
    },
    {
      id: 7,
      dateInit: 'Julio'
    },
    {
      id: 8,
      dateInit: 'Agosto'
    },
    {
      id: 9,
      dateInit: 'Septiembre'
    },
    {
      id: 10,
      dateInit: 'Octubre'
    }, {
      id: 11,
      dateInit: 'Noviembre'
    },
    {
      id: 12,
      dateInit: 'Diciembre'
    },
  ];

  indicatorsType = [
    {
      id: 1,
      type: 'Ascendente'
    },
    {
      id: 2,
      type: 'Descendente'
    }
  ]
  USER_DATA = [
    { "name": "John Smith", "occupation": "Advisor", "age": 36 },
    { "name": "Muhi Masri", "occupation": "Developer", "age": 28 },
    { "name": "Peter Adams", "occupation": "HR", "age": 20 },
    { "name": "Lora Bay", "occupation": "Marketing", "age": 43 }
  ];
  panelOpenState = false;



  constructor(
    private _evaluationService: EvaluationService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _objetivesService: ObjetivesService,
  ) { }

  ngOnInit(): void {

    this.departments$ = this._evaluationService.departments$;
    this.objetives$ = this._evaluationService.objetives$;
    this.indicators$ = this._evaluationService.indicators$;
  }
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}

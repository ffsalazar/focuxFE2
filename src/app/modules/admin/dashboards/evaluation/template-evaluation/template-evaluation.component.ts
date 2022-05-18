import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Department } from '../evaluation.types';
import { EvaluationService } from '../evaluation.service';
import { Objetive } from '../../../masters/objetives/objetives.types';
import { ObjetivesService } from '../../../masters/objetives/objetives.service';
import { filter, switchMap, takeUntil, map } from 'rxjs/operators';
import { Indicator } from 'app/modules/admin/masters/indicators/indicators.types';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { collaborators } from 'app/mock-api/dashboards/collaborators/data';

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
	templates: any[] = [];
	template: FormGroup;
	collaboratorsPerformace: any[] = [];

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
	];

	typeOperators = [
		{
		id: 1,
		type: 'Solicitud'
		},
		{
		id: 2,
		type: 'Operación'
		}
	];
	templateList = [{id: 1, name: 'Plantilla Trainee'}, {id: 2, name: 'Plantilla Jr'}, {id: 3, name: 'Plantilla S-Sr'},{id: 4, name: 'Plantilla Sr'}];

	USER_DATA = [
		{ "name": "John Smith", "occupation": "Advisor", "age": 36 },
		{ "name": "Muhi Masri", "occupation": "Developer", "age": 28 },
		{ "name": "Peter Adams", "occupation": "HR", "age": 20 },
		{ "name": "Lora Bay", "occupation": "Marketing", "age": 43 }
	];

	panelOpenState = false;
	periodId: number;
	period: FormControl;
	templateControl: FormControl;

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	constructor(
		private _evaluationService: EvaluationService,
		private _changeDetectorRef: ChangeDetectorRef,
		private _objetivesService: ObjetivesService,
		private _formBuilder: FormBuilder,
	) {
		this.template = this._formBuilder.group({
			evaluations: this._formBuilder.array([])
		});
	}

	/**
	 * On init
	 * 
	 */
	ngOnInit(): void {

		this.departments$ = this._evaluationService.departments$;
		this.objetives$ = this._evaluationService.objetives$;
		this.indicators$ = this._evaluationService.indicators$;

		this._evaluationService.collaboratorSelected$
			.subscribe(collaboratorSelected => {
				// Set collaborator selected
				let aux = collaboratorSelected || [];
				// Update select the periods
				this.period = this._formBuilder.control(this._evaluationService.period);
				console.log(this._evaluationService.template);
				this.templateControl = this._formBuilder.control(this._evaluationService.template.id);

				this._setTemplates(aux);


				// Mark for check
				this._changeDetectorRef.markForCheck();
			});
	}

	/**
	 * On destroy
	 * 
	 */
	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();
	}

	// -----------------------------------------------------------------------------------------------------
		// @ Accessors
		// -----------------------------------------------------------------------------------------------------

	get evaluations() {
		return this.template.get('evaluations') as FormArray;
	}

	step = 0;

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	private _setTemplates(selectedCollaborators: any[]) {
		this.collaboratorsPerformace = [];

		console.log("this._evaluationService.template: ", this._evaluationService.template);
		selectedCollaborators.forEach(collaborator => {
			// Create new collaborator performance
			let collaboratorPerformace: any = {
				name						: collaborator.name,
				lastName					: collaborator.lastName,
				template						: this._evaluationService.template.name,
				evaluations					: this._formBuilder.group({
					evaluationsControls		: this._formBuilder.array([])
				})
			};

			// Loop for each month
			for (let i = 1; i < 4; i++) {
				// Loop for each the template
				for (let j = 0; j < 2; j++) {
					// Add form group for each evaluation the template
					(collaboratorPerformace.evaluations.get('evaluationsControls') as FormArray).push(this._formBuilder.group({
						month            : [i],
						typeIndicator    : [{value: 1, disabled: true}],
						typeObjetive     : [{value: 1, disabled: true}],
						indicator        : [{value: 1, disabled: true}],
						objetive         : [{value: 1, disabled: true}],
						weight           : [{value: 1, disabled: true}],
						result           : [100],
						goal             : [{value: 1, disabled: true}],
						observation      : ['Cargado con exito'],
					}));
				}
			}
			
			// Add new collaborator performance
			this.collaboratorsPerformace.push(collaboratorPerformace);
		});
	}

	newEvaluation(collaborator: any) {
		(collaborator.evaluations.get('evaluationsControls') as FormArray).push(this._formBuilder.group({
			month		     : [''],
			typeIndicator    : [''],
			typeObjetive     : [''],
			indicator        : [''],
			objetive         : [''],
			weight           : [''],
			result           : [''],
			goal             : [''],
			observation      : [''],
		}));
	}

	removeEvaluation(collaborator: any, index: number) {
		(collaborator.evaluations.get('evaluationsControls') as FormArray).removeAt(index);
	}

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

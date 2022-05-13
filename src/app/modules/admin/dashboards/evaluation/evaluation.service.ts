import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { map, switchMap, filter, toArray, tap, } from 'rxjs/operators';
import { Collaborator, Department } from './evaluation.types';
import { Objetive } from '../../masters/objetives/objetives.types';
import { Indicator } from '../../masters/indicators/indicators.types';
@Injectable({
	providedIn: 'root'
})
export class EvaluationService {

	private _collaborators: BehaviorSubject<Collaborator[]> = new BehaviorSubject(null);
	private _collaboratorsSelected: Collaborator[] = [];
	private _department: BehaviorSubject<Department | null> = new BehaviorSubject(null);
	private _departments: BehaviorSubject<Department[] | null> = new BehaviorSubject(null);
	private _objetives: BehaviorSubject<Objetive[] | null> = new BehaviorSubject(null);
	private _indicators: BehaviorSubject<Indicator[] | null> = new BehaviorSubject(null);

	constructor(
		private _httpClient: HttpClient
	) { }

	// -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Getter for departments
	 * 
	 */
	get departments$(): Observable<Department[]> {
		return this._departments.asObservable();
	}

	/**
	 * Getter for _collaborators
	 * 
	 */
	get collaborators$(): Observable<Collaborator[]> {
		return this._collaborators.asObservable();
	}

	/**
	 * Getter for _objetives
	 * 
	 */
	get objetives$(): Observable<Objetive[]> {
		return this._objetives.asObservable();
	}


	/**
	 * Getter for _indicators
	 * 
	 */
	get indicators$(): Observable<Indicator[]> {
		return this._indicators.asObservable();
	}

	/**
	 * Setter for _collaboratorsSelected
	 * 
	 */
	set collaboratorsSelected(collaborators: Collaborator[]) {
		this._collaboratorsSelected = collaborators;
	}

	/**
	 * Getter for _collaboratorsSelected
	 * 
	 */
	get collaboratorsSelected() {
		return this._collaboratorsSelected;
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Compare
	 * 
	 */
	private _compare(a: Department, b: Department) {
		if (a.name < b.name) return -1;
		if (a.name > b.name) return 1;
		return 0;
	}

	/**
	 * Get departments
	 * 
	 */
	getDepartments(): Observable<Department[]> {
		return this._httpClient.get<Department[]>('http://localhost:1616/api/v1/followup/departments/all')
			.pipe(
				switchMap((departments: Department[]) => from(departments.sort(this._compare))),
				filter(departmet => departmet.isActive !== 0),
				toArray(),
				tap(departments => {
					console.log("departments: ", departments);
					this._departments.next(departments);
				}),
			)
	}

	/**
	 * Get collaborators
	 * 
	 * @returns 
	 */
	getCollaborators(): Observable<Collaborator[]> {
		return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/collaborators/all')
			.pipe(
				switchMap((collaborators: Collaborator[]) => from(collaborators)),
				tap(collaborator => console.log("collaborator: ", collaborator)),
				filter(collaborator => collaborator.isActive !== 0),
				toArray(),
				tap(collaborators => {
					// Update the collaborators
					this._collaborators.next(collaborators);
				}),
			);
	}

	/**
     * Get indicators
     */
	 getIndicators(): Observable<Indicator[]>
	 {
		 return this._httpClient.get<Indicator[]>('http://localhost:1616/api/v1/followup/indicator/all').pipe(
			 tap((indicators) => {
	
	
				 let indicatorFiltered : any[]=[];
	
				 function compare(a: Indicator, b: Indicator) {
					 if (a.name < b.name) return -1;
					 if (a.name > b.name) return 1;
	
	
					 return 0;
				 }
				 indicators.sort(compare);
				 indicators.forEach((indicator) => {
					 if (indicator.isActive != 0){
						 indicatorFiltered.push(indicator);
					 }
				 });
				 console.log("indicators", indicators)
				 this._indicators.next(indicatorFiltered);
	
			 })
		 );
	 }

	/**
		 * Get objetives
		 * 
		 * @returns 
		 */
	getObjectives(): Observable<Objetive[]> {
		return this._httpClient
			.get<Objetive[]>('http://localhost:1616/api/v1/followup/target/all')
			.pipe(
				tap((objetives) => {
					console.log("objetives", objetives)
					this._objetives.next(objetives);
				})
			);
	}




}



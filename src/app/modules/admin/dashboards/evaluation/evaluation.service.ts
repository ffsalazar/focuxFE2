import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { map, switchMap, filter, toArray, tap, } from 'rxjs/operators';
import { Collaborator, Department } from './evaluation.types';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  	private _collaborators: BehaviorSubject<Collaborator[]> = new BehaviorSubject(null);
	private _collaboratorsSelected: Collaborator[] = [];
    private _department: BehaviorSubject<Department | null> = new BehaviorSubject(null);
    private _departments: BehaviorSubject<Department[] | null> = new BehaviorSubject(null);

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
	get departments$(): Observable<Department[]>
	{
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


}

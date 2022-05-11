import { Injectable } from '@angular/core';
import {
	Resolve,
	RouterStateSnapshot,
	ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { EvaluationService } from './evaluation.service';
import { Collaborator, Department } from './evaluation.types';

@Injectable({
	providedIn: 'root'
})

export class EvaluationResolver implements Resolve<boolean> {
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return of(true);
	}
}

@Injectable({
	providedIn: 'root'
})
export class CollaboratorsEvaluationResolver implements Resolve<Collaborator[]> {

	/**
     * Constructor
     */
	 constructor(
        private _evaluationService: EvaluationService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Collaborator[]> {
		return this._evaluationService.getCollaborators();
	}
}

@Injectable({
    providedIn: 'root'
})
export class DepartmentsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
		private _evaluationService: EvaluationService
	)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Department[]>
    {
        return this._evaluationService.getDepartments();
    }
}



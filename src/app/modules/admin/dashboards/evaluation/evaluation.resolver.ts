import { Injectable } from '@angular/core';
import {
	Resolve,
	RouterStateSnapshot,
	ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { EvaluationService } from './evaluation.service';
import { Client, Collaborator, Department, Knowledge } from './evaluation.types';
import { Objetive } from '../../masters/objetives/objetives.types';
import { Indicator } from '../../masters/indicators/indicators.types';

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

@Injectable({
    providedIn: 'root'
})
export class ObjetivesResolver implements Resolve<any>
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Objetive[]>
    {
        return this._evaluationService.getObjectives();
    }
}

@Injectable({
    providedIn: 'root'
})
export class IndicatorsResolver implements Resolve<Indicator[]>
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Indicator[]>
    {
        return this._evaluationService.getIndicators();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ClientsResolver implements Resolve<Client[]>
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Client[]>
    {
        return this._evaluationService.getClients();
    }
}

@Injectable({
    providedIn: 'root'
})
export class KnowledgesResolver implements Resolve<Knowledge[]>
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Knowledge[]>
    {
        return this._evaluationService.getKnowledges();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CollaboratorsEvaluatedResolver implements Resolve<Collaborator[]>
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Collaborator[]>
    {
        return this._evaluationService.getCollaboratorsEvaluated();
    }
}

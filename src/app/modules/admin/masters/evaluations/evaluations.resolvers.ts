import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Evaluation } from './evaluations.types';
import { EvaluationsService } from './evaluations.service';
import { Objetive } from '../objetives/objetives.types';
import { Indicator } from '../indicators/indicators.types';

@Injectable({
    providedIn: 'root',
})
export class EvaluationsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _evaluationsService: EvaluationsService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Evaluation[]> {
        return this._evaluationsService.getEvaluations();
    }
}

@Injectable({
    providedIn: 'root',
})
export class EvaluationsEvaluationResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _evaluationsService: EvaluationsService,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Evaluation> {
        return this._evaluationsService
            .getEvaluationById(parseInt(route.paramMap.get('id')))
            .pipe(
                // Error here means the requested evaluation is not available
                catchError((error) => {
                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url
                        .split('/')
                        .slice(0, -1)
                        .join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}

@Injectable({
    providedIn: 'root',
})
export class ObjetivesResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _evaluationsService: EvaluationsService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Objetive[]> {
        return this._evaluationsService.getObjetives();
    }
}

@Injectable({
    providedIn: 'root',
})
export class IndicatorsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _evaluationsService: EvaluationsService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Indicator[]> {
        return this._evaluationsService.getIndicators();
    }
}

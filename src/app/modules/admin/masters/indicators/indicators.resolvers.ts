import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Indicator} from 'app/modules/admin/masters/indicators/indicators.types';
import {IndicatorsService} from "./indicators.service";


@Injectable({
    providedIn: 'root'
})
export class IndicatorsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _indicatorsService: IndicatorsService)
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
        return this._indicatorsService.getIndicators();
    }
}

@Injectable({
    providedIn: 'root'
})
export class IndicatorsIndicatorResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _indicatorsService: IndicatorsService,
        private _router: Router
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Indicator>
    {
        return this._indicatorsService.getIndicatorById(parseInt(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested indicator is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}








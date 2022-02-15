import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TechnicalArea} from 'app/modules/admin/masters/technicalAreas/technicalAreas.types';
import {TechnicalAreasService} from "./technicalAreas.service";


@Injectable({
    providedIn: 'root'
})
export class TechnicalAreasResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _technicalAreasService: TechnicalAreasService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TechnicalArea[]>
    {
        return this._technicalAreasService.getTechnicalAreas();
    }
}

@Injectable({
    providedIn: 'root'
})
export class TechnicalAreasTechnicalAreaResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _technicalAreasService: TechnicalAreasService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TechnicalArea>
    {
        return this._technicalAreasService.getTechnicalAreaById(parseInt(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested technicalArea is not available
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








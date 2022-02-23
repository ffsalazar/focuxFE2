import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommercialArea} from 'app/modules/admin/masters/commercialAreas/commercialAreas.types';
import {CommercialAreasService} from "./commercialAreas.service";


@Injectable({
    providedIn: 'root'
})
export class CommercialAreasResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _commercialAreasService: CommercialAreasService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CommercialArea[]>
    {
        return this._commercialAreasService.getCommercialAreas();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CommercialAreasCommercialAreaResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _commercialAreasService: CommercialAreasService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CommercialArea>
    {
        return this._commercialAreasService.getCommercialAreaById(parseInt(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested commercialArea is not available
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








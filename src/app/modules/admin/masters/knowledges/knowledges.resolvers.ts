import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Knowledge} from 'app/modules/admin/masters/knowledges/knowledges.types';
import {KnowledgesService} from "./knowledges.service";


@Injectable({
    providedIn: 'root'
})
export class KnowledgesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _knowledgesService: KnowledgesService)
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
        return this._knowledgesService.getKnowledges();
    }
}

@Injectable({
    providedIn: 'root'
})
export class KnowledgesKnowledgeResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _knowledgesService: KnowledgesService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Knowledge>
    {
        return this._knowledgesService.getKnowledgeById(parseInt(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested knowledge is not available
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








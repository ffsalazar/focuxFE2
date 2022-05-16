import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Objetive } from './objetives.types';
import { ObjetivesService } from './objetives.service';

@Injectable({
    providedIn: 'root',
})
export class ObjetivesResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _objetivesService: ObjetivesService) {}

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
        return this._objetivesService.getObjetives();
    }
}

@Injectable({
    providedIn: 'root',
})
export class ObjetivesObjetiveResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _objetivesService: ObjetivesService,
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
    ): Observable<Objetive> {
        return this._objetivesService
            .getObjetiveById(parseInt(route.paramMap.get('id')))
            .pipe(
                // Error here means the requested objetive is not available
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

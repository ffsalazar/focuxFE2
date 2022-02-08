import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Department} from 'app/modules/admin/masters/departments/departments.types';
import {DepartmentsService} from "./departments.service";


@Injectable({
    providedIn: 'root'
})
export class DepartmentsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _departmentsService: DepartmentsService)
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
        return this._departmentsService.getDepartments();
    }
}

@Injectable({
    providedIn: 'root'
})
export class DepartmentsDepartmentResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _departmentsService: DepartmentsService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Department>
    {
        return this._departmentsService.getDepartmentById(parseInt(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested department is not available
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








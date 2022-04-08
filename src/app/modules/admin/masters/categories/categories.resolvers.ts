import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category} from 'app/modules/admin/masters/categories/categories.types';
import {CategoriesService} from './categories.service';


@Injectable({
    providedIn: 'root'
})
export class CategoriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _categoriesService: CategoriesService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category[]>
    {
        return this._categoriesService.getCategories();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CategoriesCategoryResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _categoriesService: CategoriesService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category>
    {
        return this._categoriesService.getCategoryById(parseInt(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested category is not available
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








import { Route } from '@angular/router';
import {CategoriesComponent} from './categories.component';
import {CategoriesListComponent} from './list/list.component';
import {CategoriesDetailsComponent} from './details/details.component';
import {CanDeactivateCategoriesDetails} from './categories.guards';
import {
    CategoriesResolver,
   CategoriesCategoryResolver

} from './categories.resolvers';


export const categoriesRoutes: Route[] = [
    {
        path     : '',
        component: CategoriesComponent,

        children : [
            {
                path     : '',
                component: CategoriesListComponent,
                resolve  : {
                    tasks    : CategoriesResolver

                },
                children : [
                    {
                        path         : ':id',
                        component    : CategoriesDetailsComponent,
                        resolve      : {
                            task     : CategoriesCategoryResolver
                        },
                        canDeactivate: [CanDeactivateCategoriesDetails]
                    }
                ]
            }
        ]
    }
];

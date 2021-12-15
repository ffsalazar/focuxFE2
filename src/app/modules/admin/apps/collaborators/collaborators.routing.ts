import { Route } from '@angular/router';


import { RequestBrandsResolver, RequestCategoriesResolver, RequestProductsResolver, RequestTagsResolver, RequestVendorsResolver } from 'app/modules/admin/apps/portafolio/request/request.resolvers';

import {CollaboratorComponent} from "./collaborator/collaborator.component";
import {CollaboratorListComponent} from "./collaborator/list/collaborator.component";

export const collaboratorsRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'collaborator'
    },
    {
        path     : 'collaborator',
        component: CollaboratorComponent,
        children : [
            {
                path     : '',
                component: CollaboratorListComponent,
                resolve  : {
                    brands    : RequestBrandsResolver,
                    categories: RequestCategoriesResolver,
                    products  : RequestProductsResolver,
                    tags      : RequestTagsResolver,
                    vendors   : RequestVendorsResolver
                }
            }
        ]
        /*children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]*/
    }
];

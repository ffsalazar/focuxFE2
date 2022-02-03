import { Route } from '@angular/router';
import { RequestComponent} from "./request/request.component";

import { RequestBrandsResolver, RequestCategoriesResolver, RequestProductsResolver, RequestTagsResolver, RequestVendorsResolver } from 'app/modules/admin/apps/portafolio/request/request.resolvers';
import {RequestListComponent} from "./request/list/request.component";
import {ClientsResolver} from "./clients/clients.resolvers";
import {ClientsComponent} from "./clients/clients.component";
import {ClientsListComponent} from "./clients/list/list.component";

export const portafolioRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'request'
    },
    {
        path     : 'request',
        component: RequestComponent,
        children : [
            {
                path     : '',
                component: RequestListComponent,
                resolve  : {
                    brands    : RequestBrandsResolver,
                    categories: RequestCategoriesResolver,
                    products  : RequestProductsResolver,
                    tags      : RequestTagsResolver,
                    vendors   : RequestVendorsResolver
                }
            }
        ]
    }

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

];

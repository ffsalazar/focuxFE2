import { Route } from '@angular/router';
import { RequestComponent} from "./request/request.component";

import { RequestBrandsResolver, RequestCategoriesResolver, RequestClientsResolver, RequestComercAreaResolver, RequestPeriodResolver, RequestProductsResolver, RequestStatusResolver, RequestTagsResolver, RequestTypeResolver, RequestVendorsResolver, TechnicalAreaResolver } from 'app/modules/admin/apps/portafolio/request/request.resolvers';
import {RequestListComponent} from "./request/list/request.component";

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
                    brands      : RequestBrandsResolver,
                    categories  : RequestCategoriesResolver,
                    products    : RequestProductsResolver,
                    tags        : RequestTagsResolver,
                    vendors     : RequestVendorsResolver,
                    clients     : RequestClientsResolver,
                    commerc     : RequestComercAreaResolver,
                    status      : RequestStatusResolver,
                    requestp    : RequestPeriodResolver,
                    typereq     : RequestTypeResolver,
                    areatech    : TechnicalAreaResolver
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

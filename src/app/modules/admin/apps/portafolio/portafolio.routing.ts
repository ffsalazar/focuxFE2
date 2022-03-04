import { Route } from '@angular/router';
import { RequestComponent} from "./request/request.component";

import {
    RequestBrandsResolver,
    RequestCategoriesResolver,
    RequestClientsResolver,
    RequestComercAreaResolver,
    RequestPeriodResolver,
    RequestStatusResolver,
    RequestTagsResolver,
    RequestTypeResolver,
    TechnicalAreaResolver,
    BusinessTypeResolver,
    CollaboratorResolver
} from 'app/modules/admin/apps/portafolio/request/request.resolvers';
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
                    brands          : RequestBrandsResolver,
                    categories      : RequestCategoriesResolver,
                    tags            : RequestTagsResolver,
                    clients         : RequestClientsResolver,
                    commerc         : RequestComercAreaResolver,
                    status          : RequestStatusResolver,
                    requestp        : RequestPeriodResolver,
                    typereq         : RequestTypeResolver,
                    areatech        : TechnicalAreaResolver,
                    businessType    : BusinessTypeResolver,
                    collaborators   : CollaboratorResolver,
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

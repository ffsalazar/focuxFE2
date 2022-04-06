import { Route } from '@angular/router';
import {TypeRequestComponent} from './typeRequest.component';
import {TypeRequestListComponent} from './list/list.component';
import {TypeRequestDetailsComponent} from './details/details.component';
import {CanDeactivateTypeRequestDetails} from './typeRequest.guards';
import {
    TypeRequestResolver,
   TypeRequestsTypeRequestResolver

} from './typeRequest.resolvers';


export const typeRequestRoutes: Route[] = [
    {
        path     : '',
        component: TypeRequestComponent,

        children : [
            {
                path     : '',
                component: TypeRequestListComponent,
                resolve  : {
                    tasks    : TypeRequestResolver

                },
                children : [
                    {
                        path         : ':id',
                        component    : TypeRequestDetailsComponent,
                        resolve      : {
                            task     : TypeRequestsTypeRequestResolver
                        },
                        canDeactivate: [CanDeactivateTypeRequestDetails]
                    }
                ]
            }
        ]
    }
];

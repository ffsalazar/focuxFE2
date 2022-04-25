import { Route } from '@angular/router';
import {RequestRoleComponent} from './requestRole.component';
import {RequestRoleListComponent} from './list/list.component';
import {RequestRoleDetailsComponent} from './details/details.component';
import {CanDeactivateRequestRoleDetails} from './requestRole.guards';
import {
    RequestRoleResolver,
   RequestRolesRequestRoleResolver

} from './requestRole.resolvers';


export const requestRoleRoutes: Route[] = [
    {
        path     : '',
        component: RequestRoleComponent,

        children : [
            {
                path     : '',
                component: RequestRoleListComponent,
                resolve  : {
                    tasks    : RequestRoleResolver

                },
                children : [
                    {
                        path         : ':id',
                        component    : RequestRoleDetailsComponent,
                        resolve      : {
                            task     : RequestRolesRequestRoleResolver
                        },
                        canDeactivate: [CanDeactivateRequestRoleDetails]
                    }
                ]
            }
        ]
    }
];

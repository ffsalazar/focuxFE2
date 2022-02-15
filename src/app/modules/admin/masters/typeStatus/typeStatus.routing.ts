import { Route } from '@angular/router';
import {TypeStatusComponent} from "./typeStatus.component";
import {TypeStatusListComponent} from "./list/list.component";
import {TypeStatusDetailsComponent} from "./details/details.component";
import {CanDeactivateTypeStatusDetails} from "./typeStatus.guards";
import {
    TypeStatusResolver,
   TypeStatusTypeStatuResolver

} from "./typeStatus.resolvers";


export const typeStatusRoutes: Route[] = [
    {
        path     : '',
        component: TypeStatusComponent,

        children : [
            {
                path     : '',
                component: TypeStatusListComponent,
                resolve  : {
                    tasks    : TypeStatusResolver

                },
                children : [
                    {
                        path         : ':id',
                        component    : TypeStatusDetailsComponent,
                        resolve      : {
                            task     : TypeStatusTypeStatuResolver
                        },
                        canDeactivate: [CanDeactivateTypeStatusDetails]
                    }
                ]
            }
        ]
    }
];

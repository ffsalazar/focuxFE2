import { Route } from '@angular/router';
import {StatusesComponent} from "./statuses.component";
import {StatusesListComponent} from "./list/list.component";
import {StatusesDetailsComponent} from "./details/details.component";
import {CanDeactivateStatusesDetails} from "./statuses.guards";
import {
    StatusesStatusResolver,
    StatusesResolver,
    StatusesTypeStatussResolver

} from "./statuses.resolvers";


export const statusesRoutes: Route[] = [
    {
        path     : '',
        component: StatusesComponent,

        children : [
            {
                path     : '',
                component: StatusesListComponent,
                resolve  : {
                    tasks    : StatusesResolver

                },
                children : [
                    {
                        path         : ':id',
                        component    : StatusesDetailsComponent,
                        resolve      : {
                            task     : StatusesStatusResolver,
                            statusTypes: StatusesTypeStatussResolver
                        },
                        canDeactivate: [CanDeactivateStatusesDetails]
                    }
                ]
            }
        ]
    }
];

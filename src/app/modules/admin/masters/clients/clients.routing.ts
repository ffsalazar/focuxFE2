import { Route } from '@angular/router';
import {ClientsComponent} from "./clients.component";
import {ClientsListComponent} from "./list/list.component";
import {ClientsDetailsComponent} from "./details/details.component";
import {CanDeactivateClientsDetails} from "./clients.guards";
import {
    ClientsClientResolver,
    ClientsResolver,
    ClientsBusinessTypesResolver

} from "./clients.resolvers";


export const clientsRoutes: Route[] = [
    {
        path     : '',
        component: ClientsComponent,

        children : [
            {
                path     : '',
                component: ClientsListComponent,
                resolve  : {
                    tasks    : ClientsResolver

                },
                children : [
                    {
                        path         : ':id',
                        component    : ClientsDetailsComponent,
                        resolve      : {
                            task     : ClientsClientResolver,
                            businessTypes: ClientsBusinessTypesResolver
                        },
                        canDeactivate: [CanDeactivateClientsDetails]
                    }
                ]
            }
        ]
    }
];

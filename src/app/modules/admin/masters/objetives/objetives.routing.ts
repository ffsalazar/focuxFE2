import { Route } from '@angular/router';
import { ObjetivesComponent } from './objetives.component';
import { ObjetivesListComponent } from './list/list.component';
import { ObjetivesDetailsComponent } from './details/details.component';
import { CanDeactivateObjetivesDetails } from './objetives.guards';
import {
    ObjetivesObjetiveResolver,
    ObjetivesResolver,
} from './objetives.resolvers';

export const objetivesRoutes: Route[] = [
    {
        path: '',
        component: ObjetivesComponent,

        children: [
            {
                path: '',
                component: ObjetivesListComponent,
                resolve: {
                    tasks: ObjetivesResolver,
                },
                children: [
                    {
                        path: ':id',
                        component: ObjetivesDetailsComponent,
                        resolve: {
                            task: ObjetivesObjetiveResolver,
                        },
                        canDeactivate: [CanDeactivateObjetivesDetails],
                    },
                ],
            },
        ],
    },
];

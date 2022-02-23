import { Route } from '@angular/router';
import {CommercialAreasComponent} from "./commercialAreas.component";
import {CommercialAreasListComponent} from "./list/list.component";
import {CommercialAreasDetailsComponent} from "./details/details.component";
import {CanDeactivateCommercialAreasDetails} from "./commercialAreas.guards";
import {
    CommercialAreasResolver,
   CommercialAreasCommercialAreaResolver

} from "./commercialAreas.resolvers";


export const commercialAreasRoutes: Route[] = [
    {
        path     : '',
        component: CommercialAreasComponent,

        children : [
            {
                path     : '',
                component: CommercialAreasListComponent,
                resolve  : {
                    tasks    : CommercialAreasResolver

                },
                children : [
                    {
                        path         : ':id',
                        component    : CommercialAreasDetailsComponent,
                        resolve      : {
                            task     : CommercialAreasCommercialAreaResolver
                        },
                        canDeactivate: [CanDeactivateCommercialAreasDetails]
                    }
                ]
            }
        ]
    }
];

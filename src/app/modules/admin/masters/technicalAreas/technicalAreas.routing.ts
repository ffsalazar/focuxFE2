import { Route } from '@angular/router';
import {TechnicalAreasComponent} from "./technicalAreas.component";
import {TechnicalAreasListComponent} from "./list/list.component";
import {TechnicalAreasDetailsComponent} from "./details/details.component";
import {CanDeactivateTechnicalAreasDetails} from "./technicalAreas.guards";
import {
    TechnicalAreasResolver,
   TechnicalAreasTechnicalAreaResolver

} from "./technicalAreas.resolvers";


export const technicalAreasRoutes: Route[] = [
    {
        path     : '',
        component: TechnicalAreasComponent,

        children : [
            {
                path     : '',
                component: TechnicalAreasListComponent,
                resolve  : {
                    tasks    : TechnicalAreasResolver

                },
                children : [
                    {
                        path         : ':id',
                        component    : TechnicalAreasDetailsComponent,
                        resolve      : {
                            task     : TechnicalAreasTechnicalAreaResolver
                        },
                        canDeactivate: [CanDeactivateTechnicalAreasDetails]
                    }
                ]
            }
        ]
    }
];

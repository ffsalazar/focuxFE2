import { Route } from '@angular/router';
import {IndicatorsComponent} from "./indicators.component";
import {IndicatorsListComponent} from "./list/list.component";
import {IndicatorsDetailsComponent} from "./details/details.component";
import {CanDeactivateIndicatorsDetails} from "./indicators.guards";
import {
    IndicatorsResolver,
    IndicatorsIndicatorResolver

} from "./indicators.resolvers";


export const indicatorsRoutes: Route[] = [
    {
        path     : '',
        component: IndicatorsComponent,

        children : [
            {
                path     : '',
                component: IndicatorsListComponent,
                resolve  : {
                    tasks    : IndicatorsResolver

                },
                children : [
                    {
                        path         : ':id',
                        component    : IndicatorsDetailsComponent,
                        resolve      : {
                            task     : IndicatorsIndicatorResolver
                        },
                        canDeactivate: [CanDeactivateIndicatorsDetails]
                    }
                ]
            }
        ]
    }
];

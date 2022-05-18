import { Route } from '@angular/router';
import { EvaluationsComponent } from './evaluations.component';
import { EvaluationsListComponent } from './list/list.component';
import { EvaluationsDetailsComponent } from './details/details.component';
import { CanDeactivateEvaluationsDetails } from './evaluations.guards';
import {
    EvaluationsEvaluationResolver,
    EvaluationsResolver,
    ObjetivesResolver,
    IndicatorsResolver,
} from './evaluations.resolvers';

export const evaluationsRoutes: Route[] = [
    {
        path: '',
        component: EvaluationsComponent,

        children: [
            {
                path: '',
                component: EvaluationsListComponent,
                resolve: {
                    tasks: EvaluationsResolver,
                    objetives: ObjetivesResolver,
                    indicators: IndicatorsResolver,
                },
                children: [
                    {
                        path: ':id',
                        component: EvaluationsDetailsComponent,
                        resolve: {
                            task: EvaluationsEvaluationResolver,
                        },
                        canDeactivate: [CanDeactivateEvaluationsDetails],
                    },
                ],
            },
        ],
    },
];

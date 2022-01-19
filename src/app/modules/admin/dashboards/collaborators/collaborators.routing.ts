import { Route } from '@angular/router';
import {CollaboratorsComponent} from "../../dashboards/collaborators/collaborators.component";
import {CollaboratorsListComponent} from "./list/list.component";
import {CollaboratorsDetailsComponent} from "./details/details.component";
import {CanDeactivateCollaboratorsDetails} from "./collaborators.guards";
import {
    CollaboratorsCollaboratorResolver,
    CollaboratorsCountriesResolver,
    CollaboratorsResolver,
    CollaboratorsTagsResolver
} from "./collaborators.resolvers";


export const collaboratorsRoutes: Route[] = [
    {
        path     : '',
        component: CollaboratorsComponent,
        resolve  : {
            tags: CollaboratorsTagsResolver
        },
        children : [
            {
                path     : '',
                component: CollaboratorsListComponent,
                resolve  : {
                    tasks    : CollaboratorsResolver,
                    countries: CollaboratorsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : CollaboratorsDetailsComponent,
                        resolve      : {
                            task     : CollaboratorsCollaboratorResolver,
                            countries: CollaboratorsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateCollaboratorsDetails]
                    }
                ]
            }
        ]
    }
];

import { Route } from '@angular/router';
import {CollaboratorsComponent} from "../../dashboards/collaborators/collaborators.component";
import {CollaboratorsListComponent} from "./list/list.component";
import {CollaboratorsDetailsComponent} from "./details/details.component";
import {CanDeactivateCollaboratorsDetails} from "./collaborators.guards";
import {
    CollaboratorsCollaboratorResolver,
    CollaboratorsCountriesResolver,
    CollaboratorsResolver,
    CollaboratorsDepartmentsResolver,
    CollaboratorsEmployeePositionResolver,
    CollaboratorsKnowledgesResolver,
    CollaboratorsClientResolver,
    CollaboratorsCollaboratorOcupationResolver,
    CollaboratorsLeadersResolver,
    CollaboratorsStatusResolver
} from "./collaborators.resolvers";


export const collaboratorsRoutes: Route[] = [
    {
        path     : '',
        component: CollaboratorsComponent,
        resolve  : {
            knowledges: CollaboratorsKnowledgesResolver
        },
        children : [
            {
                path     : '',
                component: CollaboratorsListComponent,
                resolve  : {
                    tasks    : CollaboratorsResolver,
                    countries: CollaboratorsCountriesResolver,
                    status: CollaboratorsStatusResolver,
                    clients:CollaboratorsClientResolver,
                    leaders:CollaboratorsLeadersResolver,
                },
                children : [
                    {
                        path         : 'profile/:id',
                        component    : CollaboratorsDetailsComponent,
                        resolve      : {
                            task     : CollaboratorsCollaboratorResolver,
                            countries: CollaboratorsCountriesResolver,
                            departments: CollaboratorsDepartmentsResolver,
                            employeePositions: CollaboratorsEmployeePositionResolver,
                            clients: CollaboratorsClientResolver,
                            ocupations:CollaboratorsCollaboratorOcupationResolver,
                            leaders:CollaboratorsLeadersResolver,
                            status: CollaboratorsStatusResolver
                        },
                        canDeactivate: [CanDeactivateCollaboratorsDetails]
                    },
                    {
                        path         : 'create',
                        component    : CollaboratorsDetailsComponent,
                        resolve      : {
                            //task     : CollaboratorsCollaboratorResolver,
                            countries: CollaboratorsCountriesResolver,
                            departments: CollaboratorsDepartmentsResolver,
                            employeePositions: CollaboratorsEmployeePositionResolver,
                            clients: CollaboratorsClientResolver,
                            //ocupations:CollaboratorsCollaboratorOcupationResolver,
                            leaders:CollaboratorsLeadersResolver,
                            status: CollaboratorsStatusResolver
                        },
                        canDeactivate: [CanDeactivateCollaboratorsDetails]
                    },
                ]
            }
        ]
    }
];

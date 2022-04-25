import {Route, Router} from "@angular/router";
import {PartnerSearchComponent} from "./partner-search/partner-search.component";
import {AsignationComponent} from "./asignation/asignation.component";
import {AssignmentOccupationComponent} from "./assignment-occupation.component";
import {
    CollaboratorsResolver,
    ClientsResolver,
    OccupationCollaboratorResolver,
    KnowledgesResolver,
    RolesRequestResolver,
} from "./assignment.resolvers";


export const AssignmentOccupationRouter: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'index'
    },
    {
    path: 'index',
    component: AssignmentOccupationComponent,
    resolve : {
        collaborators: OccupationCollaboratorResolver
    },
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: 'partner-search'
            
        },
        {
            path: 'partner-search',
            component: PartnerSearchComponent,
            resolve  : {
                clients: ClientsResolver,
                knowledges: KnowledgesResolver,
                collaborators: OccupationCollaboratorResolver,
                rolesRequest: RolesRequestResolver
                //recommended : RecommendedResolver
            }
        },
        {
            path: 'assignation',
            component: AsignationComponent,
            
        }]
    }
];

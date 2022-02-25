import {Route, Router} from "@angular/router";
import {PartnerSearchComponent} from "./partner-search/partner-search.component";
import {AsignationComponent} from "./asignation/asignation.component";
import {AssignmentOccupationComponent} from "./assignment-occupation.component";
import {
    RequestBrandsResolver,
    RequestCategoriesResolver,
    RequestTagsResolver,
} from "../../apps/portafolio/request/request.resolvers";
import { CollaboratorsResolver, ClientsResolver } from "./assignment.resolvers";


export const AssignmentOccupationRouter: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'index'
    },
    {
    path: 'index',
    component: AssignmentOccupationComponent ,
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
                collaborators: CollaboratorsResolver,
                clients: ClientsResolver,
                //recommended : RecommendedResolver
            }
        },
        {
            path: 'assignation',
            component: AsignationComponent,
            
        }]
    }
];

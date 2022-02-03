import {Route, Router} from "@angular/router";
import {PartnerSearchComponent} from "./partner-search/partner-search.component";
import {AsignationComponent} from "./asignation/asignation.component";
import {AssignmentOccupationComponent} from "./assignment-occupation.component";


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
            component: PartnerSearchComponent
        },
        {
            path: 'assignation',
            component: AsignationComponent
        }]
    }
];

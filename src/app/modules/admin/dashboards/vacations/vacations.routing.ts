import {Route} from "@angular/router";
import {VacationsComponent} from "./vacations.component";
import {AssignVacationsComponent} from "./assign-vacations/assign-vacations.component";
import {ConsultVacationsComponent} from "./consult-vacations/consult-vacations.component";


export const VacationsRouting: Route[] = [
    {path: '', pathMatch: 'full', redirectTo: 'index'},
    {
        path: 'index',
        component: VacationsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'consult'
            },
            {
                path: 'consult',
                component: ConsultVacationsComponent
            },
            {
                path: 'assign',
                component: AssignVacationsComponent
            }
        ]
    }
];

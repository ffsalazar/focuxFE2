import { Route } from '@angular/router';
import {EmployeePositionComponent} from "./employeePosition.component";
import {EmployeePositionListComponent} from "./list/list.component";
import {EmployeePositionDetailsComponent} from "./details/details.component";
import {CanDeactivateEmployeePositionsDetails} from "./employeePosition.guards";
import {
    EmployeePositionsEmployeePositionResolver,
    EmployeePositionsResolver,
    EmployeePositionDepartmentsResolver

} from "./employeePosition.resolvers";


export const employeePositionsRoutes: Route[] = [
    {
        path     : '',
        component: EmployeePositionComponent,

        children : [
            {
                path     : '',
                component: EmployeePositionListComponent,
                resolve  : {
                    tasks    : EmployeePositionsResolver

                },
                children : [
                    {
                        path         : ':id',
                        component    : EmployeePositionDetailsComponent,
                        resolve      : {
                            task     : EmployeePositionsEmployeePositionResolver,
                            departments: EmployeePositionDepartmentsResolver
                        },
                        canDeactivate: [CanDeactivateEmployeePositionsDetails]
                    }
                ]
            }
        ]
    }
];

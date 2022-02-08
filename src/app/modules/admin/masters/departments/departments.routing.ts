import { Route } from '@angular/router';
import {DepartmentsComponent} from "./departments.component";
import {DepartmentsListComponent} from "./list/list.component";
import {DepartmentsDetailsComponent} from "./details/details.component";
import {CanDeactivateDepartmentsDetails} from "./departments.guards";
import {
    DepartmentsResolver,
   DepartmentsDepartmentResolver

} from "./departments.resolvers";


export const departmentsRoutes: Route[] = [
    {
        path     : '',
        component: DepartmentsComponent,

        children : [
            {
                path     : '',
                component: DepartmentsListComponent,
                resolve  : {
                    tasks    : DepartmentsResolver

                },
                children : [
                    {
                        path         : ':id',
                        component    : DepartmentsDetailsComponent,
                        resolve      : {
                            task     : DepartmentsDepartmentResolver
                        },
                        canDeactivate: [CanDeactivateDepartmentsDetails]
                    }
                ]
            }
        ]
    }
];

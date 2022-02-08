import { Route } from '@angular/router';
import {BusinessTypesComponent} from "./businessTypes.component";
import {BusinessTypesListComponent} from "./list/list.component";
import {BusinessTypesDetailsComponent} from "./details/details.component";
import {CanDeactivateBusinessTypesDetails} from "./businessTypes.guards";
import {
    BusinessTypesResolver,
   BusinessTypesBusinessTypeResolver

} from "./businessTypes.resolvers";


export const businessTypesRoutes: Route[] = [
    {
        path     : '',
        component: BusinessTypesComponent,

        children : [
            {
                path     : '',
                component: BusinessTypesListComponent,
                resolve  : {
                    tasks    : BusinessTypesResolver

                },
                children : [
                    {
                        path         : ':id',
                        component    : BusinessTypesDetailsComponent,
                        resolve      : {
                            task     : BusinessTypesBusinessTypeResolver
                        },
                        canDeactivate: [CanDeactivateBusinessTypesDetails]
                    }
                ]
            }
        ]
    }
];

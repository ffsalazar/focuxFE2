import { Route } from '@angular/router';
import {KnowledgesComponent} from "./knowledges.component";
import {KnowledgesListComponent} from "./list/list.component";
import {KnowledgesDetailsComponent} from "./details/details.component";
import {CanDeactivateKnowledgesDetails} from "./knowledges.guards";
import {
    KnowledgesResolver,
   KnowledgesKnowledgeResolver

} from "./knowledges.resolvers";


export const knowledgesRoutes: Route[] = [
    {
        path     : '',
        component: KnowledgesComponent,

        children : [
            {
                path     : '',
                component: KnowledgesListComponent,
                resolve  : {
                    tasks    : KnowledgesResolver

                },
                children : [
                    {
                        path         : ':id',
                        component    : KnowledgesDetailsComponent,
                        resolve      : {
                            task     : KnowledgesKnowledgeResolver
                        },
                        canDeactivate: [CanDeactivateKnowledgesDetails]
                    }
                ]
            }
        ]
    }
];

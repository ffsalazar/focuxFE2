import { Route } from '@angular/router';
import { RequestPanelComponent } from 'app/modules/admin/dashboards/RequestPanel/RequestPanel.component';
import { RequestPanelResolver } from 'app/modules/admin/dashboards/RequestPanel/RequestPanel.resolvers';

export const RequestPanelRoutes: Route[] = [
    {
        path     : '',
        component: RequestPanelComponent,
        resolve  : {
            data: RequestPanelResolver
        }
    }
];

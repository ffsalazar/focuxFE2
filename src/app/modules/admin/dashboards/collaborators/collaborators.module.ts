import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as moment from 'moment';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { CollaboratorsComponent } from 'app/modules/admin/dashboards/collaborators/collaborators.component';
import { CollaboratorsDetailsComponent } from 'app/modules/admin/dashboards/collaborators/details/details.component';
import { CollaboratorsListComponent } from 'app/modules/admin/dashboards/collaborators/list/list.component';
import { FocusPopupRequestComponent} from "./details/focux-popup-request/focus-popup-request.component";
import {collaboratorsRoutes} from "./collaborators.routing";
import {PriorityRequestModule} from "../../../../shared/pipes/priority-request/priority-request.module";
import {KnowledgeLevelModule} from "../../../../shared/pipes/knowledge-level/knowledge-level.module";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MAT_DATE_LOCALE} from '@angular/material/core';

@NgModule({
    declarations: [
        CollaboratorsComponent,
        CollaboratorsListComponent,
        CollaboratorsDetailsComponent,
        FocusPopupRequestComponent
    ],
    imports: [
        RouterModule.forChild(collaboratorsRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatMomentDateModule,
        MatProgressBarModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatTableModule,
        MatTooltipModule,
        FuseFindByKeyPipeModule,
        SharedModule,
        PriorityRequestModule,
        MatSlideToggleModule,
        KnowledgeLevelModule,
    ],
    providers   : [
        {
            provide : MAT_DATE_FORMATS,
            useValue: {
                parse  : {
                    dateInput: moment.ISO_8601
                },
                display: {
                    dateInput         : 'LL',
                    monthYearLabel    : 'MMM YYYY',
                    dateA11yLabel     : 'LL',
                    monthYearA11yLabel: 'MMMM YYYY'
                }
            }
        },
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
    ]
})
export class CollaboratorsModule
{
}

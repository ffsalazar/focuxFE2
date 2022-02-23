import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { portafolioRoutes } from 'app/modules/admin/apps/portafolio/portafolio.routing';
import {RequestComponent} from "./request/request.component";
import {RequestListComponent} from "./request/list/request.component";
import { RequestStepperComponent } from './request/list/request-stepper/request-stepper/request-stepper.component';
import { RequestStepOneComponent } from './request/list/request-stepper/request-stepper/request-step-one/request-step-one.component';
import { RequestStepTwoComponent } from './request/list/request-stepper/request-stepper/request-step-two/request-step-two.component';
import { RequestStepThirdComponent } from './request/list/request-stepper/request-stepper/request-step-third/request-step-third.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MomentModule } from 'ngx-moment';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FuseAlertModule } from '@fuse/components/alert';
import { FocuxPopupComponent } from './request/focux-popup/focux-popup.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { MatTableModule } from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
    declarations: [
        RequestComponent,
        RequestListComponent,
        RequestStepperComponent,
        RequestStepOneComponent,
        RequestStepTwoComponent,
        RequestStepThirdComponent,
        FocuxPopupComponent
    ],
    imports: [
        RouterModule.forChild(portafolioRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatStepperModule,
        MatDatepickerModule,
        SharedModule,
        MomentModule,
        MatMomentDateModule,
        FuseAlertModule,
        MatAutocompleteModule,
        MatTableModule,
        MatProgressSpinnerModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
    ]
})
export class PortafolioModule
{
}

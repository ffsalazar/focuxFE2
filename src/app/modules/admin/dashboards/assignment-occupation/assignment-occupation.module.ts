import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentOccupationComponent } from './assignment-occupation.component';
import { PartnerSearchComponent } from './partner-search/partner-search.component';
import { AsignationComponent } from './asignation/asignation.component';
import {TranslocoModule} from "@ngneat/transloco";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
 import {MatRadioModule} from '@angular/material/radio'; 
import {MatRippleModule, MAT_DATE_LOCALE} from "@angular/material/core";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {RouterModule} from "@angular/router";
import {RequestPanelRoutes} from "../requestPanel/requestPanel.routing";
import {AssignmentOccupationRouter} from "./assignment-occupation.routing";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
 import {MatSliderModule} from '@angular/material/slider'; 
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SearchBoxModule} from "../../../../shared/components/search-box/search-box.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTabsModule} from "@angular/material/tabs";
import {FuseAlertModule} from "../../../../../@fuse/components/alert";
import { FilterCollaboratorPipe } from './pipes/filter-collaborator.pipe';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgxSpinnerModule } from "ngx-spinner";
import {MatTooltipModule} from '@angular/material/tooltip';
import {AssingmentOccupationService} from "./assingment-occupation.service";
import { EditAssignmentComponent } from './edit-assignment/edit-assignment.component';
import { UpdateOccupationComponent } from './edit-assignment/update-occupation/update-occupation.component';
import { ListCollaboratorsComponent } from './edit-assignment/list-collaborators/list-collaborators.component';
import { RolesRequestResolver } from './assignment.resolvers';
@NgModule({
  declarations: [
    AssignmentOccupationComponent,
    PartnerSearchComponent,
    AsignationComponent,
    FilterCollaboratorPipe,
    EditAssignmentComponent,
    UpdateOccupationComponent,
    ListCollaboratorsComponent,
  ],
    imports: [
        CommonModule,
        TranslocoModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatRippleModule,
        MatProgressBarModule,
        RouterModule.forChild(AssignmentOccupationRouter),
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        SearchBoxModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatAutocompleteModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatTabsModule,
        FuseAlertModule,
        FormsModule,
        MatCheckboxModule,
        NgxSpinnerModule,
        MatTooltipModule,
        MatSliderModule,
        MatRadioModule,
    ],
    schemas: [
          CUSTOM_ELEMENTS_SCHEMA,
      ],
     providers   : [
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
    ],
    
})
export class AssignmentOccupationModule { }

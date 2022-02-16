import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentOccupationComponent } from './assignment-occupation.component';
import { PartnerSearchComponent } from './partner-search/partner-search.component';
import { AsignationComponent } from './asignation/asignation.component';
import {TranslocoModule} from "@ngneat/transloco";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatRippleModule} from "@angular/material/core";
import {RouterModule} from "@angular/router";
import {RequestPanelRoutes} from "../requestPanel/requestPanel.routing";
import {AssignmentOccupationRouter} from "./assignment-occupation.routing";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {AssingmentOccupationService} from "./assingment-occupation.service";
import {MatSelectModule} from "@angular/material/select";
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



@NgModule({
  declarations: [
    AssignmentOccupationComponent,
    PartnerSearchComponent,
    AsignationComponent
  ],
    imports: [
        CommonModule,
        TranslocoModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatRippleModule,
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
        FormsModule
    ],
    providers: [
        AssingmentOccupationService
    ]
})
export class AssignmentOccupationModule { }

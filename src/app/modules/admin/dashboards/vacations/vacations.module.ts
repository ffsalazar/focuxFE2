import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacationsComponent } from './vacations.component';
import { ConsultVacationsComponent } from './consult-vacations/consult-vacations.component';
import { AssignVacationsComponent } from './assign-vacations/assign-vacations.component';
import {RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {TranslocoModule} from "@ngneat/transloco";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule, MAT_DATE_LOCALE} from "@angular/material/core";
import {VacationsRouting} from "./vacations.routing";
import {SearchBoxModule} from "../../../../shared/components/search-box/search-box.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {FuseAlertModule} from "../../../../../@fuse/components/alert";
import {FuseCardModule} from "../../../../../@fuse/components/card";



@NgModule({
  declarations: [
    VacationsComponent,
    ConsultVacationsComponent,
    AssignVacationsComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        TranslocoModule,
        MatButtonModule,
        MatRippleModule,
        RouterModule.forChild(VacationsRouting),
        SearchBoxModule,
        MatFormFieldModule,
        MatMomentDateModule,
        MatSelectModule,
        MatDatepickerModule,
        MatInputModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatTableModule,
        FuseAlertModule,
        FuseCardModule
    ],
      providers   : [
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
    ]
})
export class VacationsModule { }

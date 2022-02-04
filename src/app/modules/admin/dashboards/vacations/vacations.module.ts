import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacationsComponent } from './vacations.component';
import { ConsultVacationsComponent } from './consult-vacations/consult-vacations.component';
import { AssignVacationsComponent } from './assign-vacations/assign-vacations.component';
import {RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {TranslocoModule} from "@ngneat/transloco";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";
import {VacationsRouting} from "./vacations.routing";
import {SearchBoxModule} from "../../../../shared/components/search-box/search-box.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";



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
        MatSelectModule
    ]
})
export class VacationsModule { }

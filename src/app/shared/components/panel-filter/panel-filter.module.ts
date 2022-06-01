import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {DividerModule} from '../../directives/divider/divider.module';
import {MatRippleModule} from '@angular/material/core';
import {HighlightSearchModule} from '../../pipes/highlight-search/highlight-search.module';
import {MatInputModule} from "@angular/material/input";

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { PanelFilterComponent } from './panel-filter.component';

@NgModule({
  declarations: [
    PanelFilterComponent,
  ],
  exports : [
    PanelFilterComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatDividerModule,
    DividerModule,
    MatRippleModule,
    HighlightSearchModule,
    HighlightSearchModule,
    MatInputModule,
    MatCheckboxModule,
    MatSliderModule,
    MatDatepickerModule,
    MatMomentDateModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PanelFilterModule { }

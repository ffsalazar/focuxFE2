import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchBoxComponent} from './search-box.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {DividerModule} from '../../directives/divider/divider.module';
import {MatRippleModule} from '@angular/material/core';
import {HighlightSearchModule} from '../../pipes/highlight-search/highlight-search.module';
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [SearchBoxComponent],
  exports: [
    SearchBoxComponent
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
    ]
})
export class SearchBoxModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HighlightSearchPipe} from './highlight-search.pipe';


@NgModule({
  declarations: [HighlightSearchPipe],
  exports: [
    HighlightSearchPipe
  ],
  imports: [
    CommonModule
  ]
})
export class HighlightSearchModule {
}

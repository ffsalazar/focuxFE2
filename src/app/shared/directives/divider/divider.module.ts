import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DividerDirective} from './divider.directive';

@NgModule({
  declarations: [DividerDirective],
  exports: [
    DividerDirective
  ],
  imports: [
    CommonModule
  ]
})
export class DividerModule {
}

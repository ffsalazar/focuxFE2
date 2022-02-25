import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PriorityRequestPipe} from './priority-request.pipe';


@NgModule({
  declarations: [PriorityRequestPipe],
  exports: [
    PriorityRequestPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PriorityRequestModule {
}

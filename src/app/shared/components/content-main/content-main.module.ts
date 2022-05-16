import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentMainComponent } from './content-main.component';



@NgModule({
  declarations: [
    ContentMainComponent
  ],
  exports: [
    ContentMainComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class ContentMainModule { }

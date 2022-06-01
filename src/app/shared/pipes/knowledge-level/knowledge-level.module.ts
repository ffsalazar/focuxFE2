import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnowledgeLevelPipe } from './knowledge-level.pipe';



@NgModule({
  declarations: [
    KnowledgeLevelPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    KnowledgeLevelPipe,
  ]
})
export class KnowledgeLevelModule { }

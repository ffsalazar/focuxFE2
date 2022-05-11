import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EvaluationComponent} from "./evaluation.component";
import { CollaboratorsEvaluationResolver, DepartmentsResolver } from './evaluation.resolver';

const routes: Routes = [{
    path: '',
    component: EvaluationComponent,
    resolve: {
      collaborators: CollaboratorsEvaluationResolver,
      departments: DepartmentsResolver,
    }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationRoutingModule { }

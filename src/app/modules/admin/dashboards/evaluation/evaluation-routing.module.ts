import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {EvaluationComponent} from "./evaluation.component";
import { CollaboratorsEvaluationResolver, DepartmentsResolver, ObjetivesResolver, IndicatorsResolver } from './evaluation.resolver';

const routes: Routes = [{
    path: '',
    component: EvaluationComponent,
    resolve: {
      collaborators: CollaboratorsEvaluationResolver,
      departments: DepartmentsResolver,
      objetives: ObjetivesResolver,
      indicators: IndicatorsResolver
    }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationRoutingModule { }

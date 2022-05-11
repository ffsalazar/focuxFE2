import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
@Component({
  selector: 'app-list-evaluation',
  templateUrl: './list-evaluation.component.html',
  styleUrls: ['./list-evaluation.component.scss']
})
export class ListEvaluationComponent implements OnInit {
    filterCollaboratorsGroup: FormGroup;
    selectedFilterClient: boolean = false;
    selectedFilterKnowledge: boolean = false;
    selectedFilterOccupation: boolean = false;
    range: FormGroup = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });
  constructor(   private _fb: FormBuilder, )  {
      // Create form group for filter collaborators
      this.filterCollaboratorsGroup = this._fb.group({
          filterClients: new FormArray([]),
          filterKnowledges: new FormArray([]),
          filterOccupation: [0],
          filterDateInit: [''],
          filterDateEnd: [''],
      });
  }

  ngOnInit(): void {
  }

    /**
     * Filter clients
     */
    get filterClients() {
        return this.filterCollaboratorsGroup.get('filterClients') as FormArray;
    }

    /**
     * Filter knowledges
     */
    get filterKnowledges(): FormArray {
        return this.filterCollaboratorsGroup.get(
            'filterKnowledges'
        ) as FormArray;
    }
    /**
     * Filter occupations
     */
    get filterOccupation(): AbstractControl {
        return this.filterCollaboratorsGroup.get('filterOccupation');
    }

}


import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from "@angular/router";
import {AssingmentOccupationService} from "./assingment-occupation.service";
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-assignment-occupation',
  templateUrl: './assignment-occupation.component.html',
  styleUrls: ['./assignment-occupation.component.scss']
})
export class AssignmentOccupationComponent implements OnInit {

	@ViewChild(MatTabGroup) private _tab: MatTabGroup;

    tabIndex = 0;

  	constructor(
		private _router: Router,
        private _assingmentOccupationService: AssingmentOccupationService) {
		}

	ngOnInit(): void {
	}

  /**
     * Select Tab
     */
    selectTab() {
        switch ( this._tab.selectedIndex ) {
            case 0:
                //this.getCollaboratorsRecommended();
                break;
            case 1:
                this._assingmentOccupationService.setCollaboratorSelected();
                break;
        
            default:
                break;
        }
    }
}

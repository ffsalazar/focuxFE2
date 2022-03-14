import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from "@angular/router";
import {AssingmentOccupationService} from "./assingment-occupation.service";
import { MatTabGroup } from '@angular/material/tabs';
import { NgxSpinnerService } from "ngx-spinner";
import { LoadingSpinnerService } from 'app/core/services/loading-spinner/loading-spinner.service';

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
        private _assingmentOccupationService: AssingmentOccupationService,
        private spinner: NgxSpinnerService,
        private _loadingSpinnerService: LoadingSpinnerService) {
		}

	ngOnInit(): void {
        this._handleEventSavedOccupation();

        this._loadingSpinnerService._isLoading$
            .subscribe(startLoading => {
                startLoading ? this.spinner.show() : this.spinner.hide();
            });
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

    private _handleEventSavedOccupation() {
        this._assingmentOccupationService.tabIndex$
            .subscribe((value) => {
                console.log("tab: ", value);
                this._tab.selectedIndex = 0;
            });
    }
}

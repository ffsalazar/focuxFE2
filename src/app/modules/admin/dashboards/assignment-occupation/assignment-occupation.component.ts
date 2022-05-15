import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from "@angular/router";
import {AssingmentOccupationService} from "./assingment-occupation.service";
import { MatTabGroup } from '@angular/material/tabs';
import { NgxSpinnerService } from "ngx-spinner";
import { LoadingSpinnerService } from 'app/core/services/loading-spinner/loading-spinner.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-assignment-occupation',
  templateUrl: './assignment-occupation.component.html',
  styleUrls: ['./assignment-occupation.component.scss']
})
export class AssignmentOccupationComponent implements OnInit {

	@ViewChild(MatTabGroup) private _tab: MatTabGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tabIndex = 0;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    
  	constructor(
		private _router: Router,
        private _assingmentOccupationService: AssingmentOccupationService,
        private spinner: NgxSpinnerService,
        private _loadingSpinnerService: LoadingSpinnerService) {
		}
    
    /**
     * On init
     * 
     */
	ngOnInit(): void {
        this._handleEventSavedOccupation();
        
        this._loadingSpinnerService._isLoading$
            .subscribe(startLoading => {
                startLoading ? this.spinner.show() : this.spinner.hide();
            });
	}

    /**
     * On destroy
     * 
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Select Tab
     * 
     */
    selectTab() {
        if ( this._tab?.selectedIndex && this._tab.selectedIndex === 1 ) {
            this._assingmentOccupationService.setCollaboratorSelected();
        }
    }

    /**
     * Handle event saved occupation
     * 
     */
    private _handleEventSavedOccupation() {
        this._assingmentOccupationService.tabIndex$
            .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((tabIndex) => {
                    this._tab.selectedIndex = tabIndex;
                });

            this.selectTab();

    }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgxSpinnerService } from "ngx-spinner";
import { LoadingSpinnerService } from 'app/core/services/loading-spinner/loading-spinner.service';
import { Router } from "@angular/router";
import { EvaluationService } from './evaluation.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-evaluation',
	templateUrl: './evaluation.component.html',
	styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {

	@ViewChild(MatTabGroup) private _tab: MatTabGroup;

	private _unsubscribeAll: Subject<any> = new Subject<any>();
	private _tabIndex$: Observable<number>;

	tabIndex = 0;


	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	constructor(
		private _router: Router,
		private spinner: NgxSpinnerService,
		private _evaluationService: EvaluationService,
		private _loadingSpinnerService: LoadingSpinnerService,
	) {
	}

	/**
	 * On Init
	 * 
	 */
	ngOnInit(): void {
		this._handleEventSavedOccupation();
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
		if (this._tab?.selectedIndex && this._tab.selectedIndex === 1) {
			this._evaluationService.setCollaboratorSelected();
		}
	}

	/**
	 * Handle event saved occupation
	 * 
	 */
	private _handleEventSavedOccupation() {
		this._tabIndex$ = this._evaluationService.tabIndex$
							.pipe(takeUntil(this._unsubscribeAll));

		this._tabIndex$
			.subscribe((tabIndex) => {
				this._tab.selectedIndex = tabIndex;
				//this.selectTab();
			});

	}

}



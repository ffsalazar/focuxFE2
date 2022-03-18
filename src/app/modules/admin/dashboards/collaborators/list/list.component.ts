import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormControl} from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Collaborator, Country, Status, Client } from 'app/modules/admin/dashboards/collaborators/collaborators.types';
import {CollaboratorsService} from "../collaborators.service";
import {MatOption} from "@angular/material/core";


@Component({
    selector       : 'collaborators-list',
    templateUrl    : './list.component.html',
    styles         : [
            /* language=SCSS */
            `
            #header{
                .mat-form-field.mat-form-field-appearance-fill
                .mat-form-field-wrapper
                .mat-form-field-flex {
                    padding-right: 16px !important;
                }
            }

            `
        ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollaboratorsListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    collaborators$: Observable<Collaborator[]>;

    collaboratorsCount: number = 0;
    collaboratorsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    countries: Country[];
    drawerMode: 'side' | 'over';
    statuses: Status[];
    clients: Client[];
    leaders: Collaborator[];

    selectedCollaborator: Collaborator;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('allSelectedClients') private allSelectedClients: MatOption;
    @ViewChild('allSelectedStatuses') private allSelectedStatuses: MatOption;
    @ViewChild('allSelectedLeaders') private allSelectedLeaders: MatOption;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _collaboratorsService: CollaboratorsService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _formBuilder: FormBuilder
    )
    {
    }

    filterForm = this._formBuilder.group({

        searchInputControl :  new FormControl(''),
        leaderControl          : new FormControl(''),
        centralAmericanControl : new FormControl(''),
        statusControl          : new FormControl(''),
        clientControl          : new FormControl('')


    })

    searchInputControl: FormControl = new FormControl();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the collaborators
        this.collaborators$ = this._collaboratorsService.collaborators$;


        this._collaboratorsService.collaborators$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((collaborators: Collaborator[]) => {

                this.collaboratorsCount = collaborators.length;


            });

        this._collaboratorsService.statuses$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((statuses: Status[]) => {

                this.statuses = statuses;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._collaboratorsService.clients$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((clients: Client[]) => {
            clients.sort(this.sortArray);
            this.clients = clients

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this._collaboratorsService.leaders$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((leaders: Collaborator[]) => {
                leaders.sort(this.sortArray);
                this.leaders = leaders;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        // Get the collaborator
        this._collaboratorsService.collaborator$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((collaborator: Collaborator) => {

                // Update the selected collaborator
                this.selectedCollaborator = collaborator;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the countries
        this._collaboratorsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((countries: Country[]) => {

                // Update the countries
                this.countries = countries;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.filterForm.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(controls =>

                    // Search
                    this._collaboratorsService.filtersCollaborator(controls)
                )
            )
            .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if ( !opened )
            {
                // Remove the selected collaborator when drawer closed
                this.selectedCollaborator = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {



                // Set the drawerMode if the given breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(event =>
                    (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                    && (event.key === '/') // '/'
                )
            )
            .subscribe(() => {
                this.createCollaborator();

            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    toggleAllSelectionClients() {
        if (this.allSelectedClients.selected) {
            this.filterForm.controls.clientControl.patchValue([...this.clients.map(item => item.name), 0]);
        } else {
            this.filterForm.controls.clientControl.patchValue([]);
        }
    }

    toggleAllSelectionStatuses() {
        if (this.allSelectedStatuses.selected) {
            this.filterForm.controls.statusControl.patchValue([...this.statuses.map(item => item.name), 0]);
        } else {
            this.filterForm.controls.statusControl.patchValue([]);
        }
    }

    toggleAllSelectionLeaders() {
        if (this.allSelectedLeaders.selected) {
            this.filterForm.controls.leaderControl.patchValue([...this.leaders.map(item => item.id), 0]);
        } else {
            this.filterForm.controls.leaderControl.patchValue([]);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create collaborator
     */
    createCollaborator(): void
    {
        // Create the collaborator
        this._collaboratorsService.createCollaborator().subscribe((newCollaborator) => {

            // Go to the new collaborator
            this._router.navigate(['./', newCollaborator.id], {relativeTo: this._activatedRoute});

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
    sortArray(x, y) {
    if (x.name < y.name) {return -1; }
    if (x.name > y.name) {return 1; }
    return 0;
  }

}

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Objetive } from '../objetives.types';
import { ObjetivesListComponent } from '../list/list.component';
import { ObjetivesService } from '../objetives.service';

@Component({
    selector: 'objetives-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjetivesDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('knowledgesPanel') private _knowledgesPanel: TemplateRef<any>;
    @ViewChild('knowledgesPanelOrigin')
    private _knowledgesPanelOrigin: ElementRef;

    editMode: boolean = false;

    knowledgesEditMode: boolean = false;

    objetive: Objetive;
    objetiveForm: FormGroup;
    objetives: Objetive[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _knowledgesPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _objetivesListComponent: ObjetivesListComponent,
        private _objetivesService: ObjetivesService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Open the drawer
        this._objetivesListComponent.matDrawer.open();

        // Create the objetive form
        this.objetiveForm = this._formBuilder.group({
            id: [''],
            name: [''],
            description: [''],
            type: [''],
            isActive: [''],
        });

        // Get the objetives
        this._objetivesService.objetives$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((objetives: Objetive[]) => {
                this.objetives = objetives;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the objetive
        this._objetivesService.objetive$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((objetive: Objetive) => {
                console.log(objetive);

                // Open the drawer in case it is closed
                this._objetivesListComponent.matDrawer.open();

                // Get the objetive
                this.objetive = objetive;

                // Patch values to the form
                this.objetiveForm.patchValue(objetive);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        if (this.objetive.name === 'Nueva área técnica') {
            this.editMode = true;
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if (this._knowledgesPanelOverlayRef) {
            this._knowledgesPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._objetivesListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the objetive
     */
    updateObjetive(): void {
        // Get the objetive object
        const objetive = this.objetiveForm.getRawValue();

        // Update the objetive on the server
        console.log(objetive);
        this._objetivesService
            .updateObjetive(objetive.id, objetive)
            .subscribe(() => {
                // Toggle the edit mode off
                this.toggleEditMode(false);
            });
    }

    /**
     * Delete the objetive
     */
    deleteObjetive(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Borrar &Aacute;rea T&eacute;cnica',
            message:
                '\n' +
                '¿Estás seguro de que deseas eliminar esta área técnica? ¡Esta acción no se puede deshacer!',
            actions: {
                confirm: {
                    label: 'Borrar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the current objetive's id
                const id = this.objetive.id;

                // Get the next/previous objetive's id
                const currentObjetiveIndex = this.objetives.findIndex(
                    (item) => item.id === id
                );
                let nextObjetiveId = null;
                if (currentObjetiveIndex == this.objetives.length - 1) {
                    for (let i = currentObjetiveIndex - 1; i >= 0; i--) {
                        if (this.objetives[i].isActive != 0) {
                            nextObjetiveId = this.objetives[i].id;
                        }
                    }
                } else {
                    for (
                        let i = currentObjetiveIndex + 1;
                        i < this.objetives.length;
                        i++
                    ) {
                        if (this.objetives[i].isActive != 0) {
                            nextObjetiveId = this.objetives[i].id;
                        }
                    }
                }

                // Delete the objetive
                this.objetive.isActive = 0;
                this._objetivesService
                    .deleteObjetive(this.objetive)
                    .subscribe(() => {
                        this._router.navigate(['../'], {
                            relativeTo: this._activatedRoute,
                        });

                        // Toggle the edit mode off
                        this.toggleEditMode(false);
                    });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }
}

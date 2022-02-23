import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CommercialArea} from 'app/modules/admin/masters/commercialAreas/commercialAreas.types';
import { CommercialAreasListComponent } from 'app/modules/admin/masters/commercialAreas/list/list.component';
import { CommercialAreasService } from 'app/modules/admin/masters/commercialAreas/commercialAreas.service';

@Component({
    selector       : 'commercialAreas-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommercialAreasDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('knowledgesPanel') private _knowledgesPanel: TemplateRef<any>;
    @ViewChild('knowledgesPanelOrigin') private _knowledgesPanelOrigin: ElementRef;

    editMode: boolean = false;

    knowledgesEditMode: boolean = false;

    commercialArea: CommercialArea;
    commercialAreaForm: FormGroup;
    commercialAreas: CommercialArea[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _knowledgesPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _commercialAreasListComponent: CommercialAreasListComponent,
        private _commercialAreasService: CommercialAreasService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Open the drawer
        this._commercialAreasListComponent.matDrawer.open();

        // Create the commercialArea form
        this.commercialAreaForm = this._formBuilder.group({
            id: [''],
            name: [''],
            description: [''],
            code:[''],
            isActive: ['']

        })

        // Get the commercialAreas
        this._commercialAreasService.commercialAreas$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((commercialAreas: CommercialArea[]) => {
                this.commercialAreas = commercialAreas;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the commercialArea
        this._commercialAreasService.commercialArea$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((commercialArea: CommercialArea) => {


                console.log(commercialArea)


                // Open the drawer in case it is closed
                this._commercialAreasListComponent.matDrawer.open();

                // Get the commercialArea
                this.commercialArea = commercialArea;




                // Patch values to the form
                this.commercialAreaForm.patchValue(commercialArea);

                this.commercialAreaForm.get('code').setValue(commercialArea.code);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });



        if(this.commercialArea.name === 'Nueva área comercial'){
            this.editMode = true;
        }

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if ( this._knowledgesPanelOverlayRef )
        {
            this._knowledgesPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._commercialAreasListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        console.log(this.commercialAreaForm.value);

        if ( editMode === null )
        {
            this.editMode = !this.editMode;
        }
        else
        {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the commercialArea
     */
    updateCommercialArea(): void
    {
        // Get the commercialArea object
        let commercialArea = this.commercialAreaForm.getRawValue();

        // Update the commercialArea on the server
        console.log(commercialArea)
        this._commercialAreasService.updateCommercialArea(commercialArea.id, commercialArea).subscribe(() => {

            // Toggle the edit mode off
            this.toggleEditMode(false);
        });
    }



    /**
     * Delete the commercialArea
     */
    deleteCommercialArea(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Borrar &aacute;rea comercial',
            message: '\n' +
                '¿Estás seguro de que deseas eliminar esta &aacute;rea comercial? ¡Esta acción no se puede deshacer!',
            actions: {
                confirm: {
                    label: 'Borrar'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                // Get the current commercialArea's id
                const id = this.commercialArea.id;

                // Get the next/previous commercialArea's id
                const currentCommercialAreaIndex = this.commercialAreas.findIndex(item => item.id === id);
                let nextCommercialAreaId = null;
                if (currentCommercialAreaIndex == (this.commercialAreas.length - 1)) {
                    for (let i = currentCommercialAreaIndex - 1; i >= 0; i--) {
                        if (this.commercialAreas[i].isActive != 0) {
                            nextCommercialAreaId = this.commercialAreas[i].id;
                        }
                    }
                } else {
                    for (let i = currentCommercialAreaIndex + 1; i < this.commercialAreas.length; i++) {
                        if (this.commercialAreas[i].isActive != 0) {
                            nextCommercialAreaId = this.commercialAreas[i].id;
                        }
                    }
                }


                // Delete the commercialArea
                this.commercialArea.isActive = 0;
                this._commercialAreasService.deleteCommercialArea(this.commercialArea)
                    .subscribe(() => {
                        // Navigate to the next commercialArea if available

                            this._router.navigate(['../'], {relativeTo: this._activatedRoute});


                        // Toggle the edit mode off
                        this.toggleEditMode(false);
                    });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

    }

    /**
     * Upload avatar
     *
     * @param fileList

    uploadAvatar(fileList: FileList): void
    {
        // Return if canceled
        if ( !fileList.length )
        {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if ( !allowedTypes.includes(file.type) )
        {
            return;
        }

        // Upload the avatar
        this._commercialAreasService.uploadAvatar(this.commercialArea.id, file).subscribe();
    }

    /**
     * Remove the avatar

    removeAvatar(): void
    {
        // Get the form control for 'avatar'
        const avatarFormControl = this.commercialAreaForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the commercialArea
        this.commercialArea.avatar = null;
    }*/


}

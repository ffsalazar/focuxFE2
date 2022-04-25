import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TypeRequest} from 'app/modules/admin/masters/typeRequest/typeRequest.types';
import { TypeRequestListComponent } from 'app/modules/admin/masters/typeRequest/list/list.component';
import { TypeRequestService } from 'app/modules/admin/masters/typeRequest/typeRequest.service';

@Component({
    selector       : 'typeRequests-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeRequestDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('knowledgesPanel') private _knowledgesPanel: TemplateRef<any>;
    @ViewChild('knowledgesPanelOrigin') private _knowledgesPanelOrigin: ElementRef;

    editMode: boolean = false;

    knowledgesEditMode: boolean = false;

    typeRequest: TypeRequest;
    typeRequestForm: FormGroup;
    typeRequests: TypeRequest[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _knowledgesPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _typeRequestListComponent: TypeRequestListComponent,
        private _typeRequestService: TypeRequestService,
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
        this._typeRequestListComponent.matDrawer.open();

        // Create the typeRequest form
        this.typeRequestForm = this._formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            description: [''],
            code:['', Validators.required],
            isActive: ['']

        });

        // Get the typeRequests
        this._typeRequestService.typeRequests$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((typeRequests: TypeRequest[]) => {
                this.typeRequests = typeRequests;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the typeRequest
        this._typeRequestService.typeRequest$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((typeRequest: TypeRequest) => {


                console.log(typeRequest);


                // Open the drawer in case it is closed
                this._typeRequestListComponent.matDrawer.open();

                // Get the typeRequest
                this.typeRequest = typeRequest;




                // Patch values to the form
                this.typeRequestForm.patchValue(typeRequest);

                this.typeRequestForm.get('code').setValue(typeRequest.code);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });



        if(this.typeRequest.name === 'Nuevo tipo de estatus'){
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
        return this._typeRequestListComponent.matDrawer.close();
    }
    checkError(item, type?){
        return (type) ? this.typeRequestForm.get(item).hasError(type) : (this.typeRequestForm.get(item).errors && this.typeRequestForm.get(item).touched);
    }
    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        console.log(this.typeRequestForm.value);

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
     * Update the typeRequest
     */
    updateTypeRequest(): void
    {
        // Get the typeRequest object
        const typeRequest = this.typeRequestForm.getRawValue();

        // Update the typeRequest on the server
        console.log(typeRequest);
        this._typeRequestService.updateTypeRequest(typeRequest.id, typeRequest).subscribe(() => {

            // Toggle the edit mode off
            this.toggleEditMode(false);
        });
    }



    /**
     * Delete the typeRequest
     */
    deleteTypeRequest(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Borrar Departamento',
            message: '\n' +
                '¿Estás seguro de que deseas eliminar este typeRequesto? ¡Esta acción no se puede deshacer!',
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
                // Get the current typeRequest's id
                const id = this.typeRequest.id;

                // Get the next/previous typeRequest's id
                const currentTypeRequestIndex = this.typeRequests.findIndex(item => item.id === id);
                let nextTypeRequestId = null;
                if (currentTypeRequestIndex == (this.typeRequests.length - 1)) {
                    for (let i = currentTypeRequestIndex - 1; i >= 0; i--) {
                        if (this.typeRequests[i].isActive != 0) {
                            nextTypeRequestId = this.typeRequests[i].id;
                        }
                    }
                } else {
                    for (let i = currentTypeRequestIndex + 1; i < this.typeRequests.length; i++) {
                        if (this.typeRequests[i].isActive != 0) {
                            nextTypeRequestId = this.typeRequests[i].id;
                        }
                    }
                }


                // Delete the typeRequest
                this.typeRequest.isActive = 0;
                this._typeRequestService.deleteTypeRequest(this.typeRequest)
                    .subscribe(() => {
                        // Navigate to the next typeRequest if available


                            this._router.navigate(['../'], {relativeTo: this._activatedRoute});


                        // Toggle the edit mode off
                        this.toggleEditMode(false);
                    });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

    }

    /*
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
        this._typeRequestService.uploadAvatar(this.typeRequest.id, file).subscribe();
    }

    /**
     * Remove the avatar

    removeAvatar(): void
    {
        // Get the form control for 'avatar'
        const avatarFormControl = this.typeRequestForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the typeRequest
        this.typeRequest.avatar = null;
    }*/


}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Client, BusinessType} from 'app/modules/admin/masters/clients/clients.types';
import { ClientsListComponent } from 'app/modules/admin/masters/clients/list/list.component';
import { ClientsService } from 'app/modules/admin/masters/clients/clients.service';

@Component({
    selector       : 'clients-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('knowledgesPanel') private _knowledgesPanel: TemplateRef<any>;
    @ViewChild('knowledgesPanelOrigin') private _knowledgesPanelOrigin: ElementRef;

    editMode: boolean = false;

    knowledgesEditMode: boolean = false;

    client: Client;
    clientForm: FormGroup;
    clients: Client[];
    businessTypes: BusinessType[];
    filteredBusinessTypes: BusinessType[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _knowledgesPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _clientsListComponent: ClientsListComponent,
        private _clientsService: ClientsService,
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
        this._clientsListComponent.matDrawer.open();

        // Create the client form
        this.clientForm = this._formBuilder.group({
            id: [''],
            name: [''],
            description: [''],
            isActive: [''],
            businessType: [[]]
        })

        // Get the clients
        this._clientsService.clients$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((clients: Client[]) => {
                this.clients = clients;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the client
        this._clientsService.client$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((client: Client) => {





                // Open the drawer in case it is closed
                this._clientsListComponent.matDrawer.open();

                // Get the client
                this.client = client;




                // Patch values to the form
                this.clientForm.patchValue(client);

                this.clientForm.get('businessType').setValue(client.businessType.id);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the client

        this._clientsService.businessTypes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((businessType: BusinessType[]) => {
                this.businessTypes = businessType;
                this.filteredBusinessTypes = businessType;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });



        if(this.client.name === 'Nuevo Cliente'){
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
        return this._clientsListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        console.log(this.clientForm.value);

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
     * Update the client
     */
    updateClient(): void
    {
        // Get the client object
        let client = this.clientForm.getRawValue();
        client.businessType = this.businessTypes.find(value => value.id == client.businessType)
        // Update the client on the server
        console.log(client)
        this._clientsService.updateClient(client.id, client).subscribe(() => {

            // Toggle the edit mode off
            this.toggleEditMode(false);
        });
    }

    filterPositionsByBusinessType() {
        let businessTypeSelected = this.clientForm.get("businessType").value;

        this.businessTypes = this.businessTypes.filter(elem => elem.id === businessTypeSelected)

    }

    /**
     * Delete the client
     */
    deleteClient(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Borrar Cliente',
            message: '\n' +
                '¿Estás seguro de que deseas eliminar este cliento? ¡Esta acción no se puede deshacer!',
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
                // Get the current client's id
                const id = this.client.id;

                // Get the next/previous client's id
                const currentClientIndex = this.clients.findIndex(item => item.id === id);
                let nextClientId = null;
                if (currentClientIndex == (this.clients.length - 1)) {
                    for (let i = currentClientIndex - 1; i >= 0; i--) {
                        if (this.clients[i].isActive != 0) {
                            nextClientId = this.clients[i].id;
                        }
                    }
                } else {
                    for (let i = currentClientIndex + 1; i < this.clients.length; i++) {
                        if (this.clients[i].isActive != 0) {
                            nextClientId = this.clients[i].id;
                        }
                    }
                }


                // Delete the client
                this.client.isActive = 0;
                this._clientsService.deleteClient(this.client)
                    .subscribe(() => {
                        // Navigate to the next client if available
                        if ( nextClientId )
                        {
                            this._router.navigate(['../', nextClientId], {relativeTo: this._activatedRoute});
                        }
                        // Otherwise, navigate to the parent
                        else
                        {
                            this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                        }

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
        this._clientsService.uploadAvatar(this.client.id, file).subscribe();
    }

    /**
     * Remove the avatar

    removeAvatar(): void
    {
        // Get the form control for 'avatar'
        const avatarFormControl = this.clientForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the client
        this.client.avatar = null;
    }*/


}

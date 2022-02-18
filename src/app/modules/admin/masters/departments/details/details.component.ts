import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Department} from 'app/modules/admin/masters/departments/departments.types';
import { DepartmentsListComponent } from 'app/modules/admin/masters/departments/list/list.component';
import { DepartmentsService } from 'app/modules/admin/masters/departments/departments.service';

@Component({
    selector       : 'departments-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentsDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('knowledgesPanel') private _knowledgesPanel: TemplateRef<any>;
    @ViewChild('knowledgesPanelOrigin') private _knowledgesPanelOrigin: ElementRef;

    editMode: boolean = false;

    knowledgesEditMode: boolean = false;

    department: Department;
    departmentForm: FormGroup;
    departments: Department[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _knowledgesPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _departmentsListComponent: DepartmentsListComponent,
        private _departmentsService: DepartmentsService,
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
        this._departmentsListComponent.matDrawer.open();

        // Create the department form
        this.departmentForm = this._formBuilder.group({
            id: [''],
            name: [''],
            description: [''],
            code:[''],
            isActive: ['']

        })

        // Get the departments
        this._departmentsService.departments$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((departments: Department[]) => {
                this.departments = departments;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the department
        this._departmentsService.department$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((department: Department) => {


                // Open the drawer in case it is closed
                this._departmentsListComponent.matDrawer.open();

                // Get the department
                this.department = department;




                // Patch values to the form
                this.departmentForm.patchValue(department);

                this.departmentForm.get('code').setValue(department.code);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });



        if(this.department.name === 'Nuevo Departmento'){
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
        return this._departmentsListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        console.log(this.departmentForm.value);

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
     * Update the department
     */
    updateDepartment(): void
    {
        // Get the department object
        let department = this.departmentForm.getRawValue();

        // Update the department on the server
        console.log(department)
        this._departmentsService.updateDepartment(department.id, department).subscribe(() => {

            // Toggle the edit mode off
            this.toggleEditMode(false);
        });
    }



    /**
     * Delete the department
     */
    deleteDepartment(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Borrar Departamento',
            message: '\n' +
                '¿Estás seguro de que deseas eliminar este departmento? ¡Esta acción no se puede deshacer!',
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
                // Get the current department's id
                const id = this.department.id;

                // Get the next/previous department's id
                const currentDepartmentIndex = this.departments.findIndex(item => item.id === id);
                let nextDepartmentId = null;
                if (currentDepartmentIndex == (this.departments.length - 1)) {
                    for (let i = currentDepartmentIndex - 1; i >= 0; i--) {
                        if (this.departments[i].isActive != 0) {
                            nextDepartmentId = this.departments[i].id;
                        }
                    }
                } else {
                    for (let i = currentDepartmentIndex + 1; i < this.departments.length; i++) {
                        if (this.departments[i].isActive != 0) {
                            nextDepartmentId = this.departments[i].id;
                        }
                    }
                }


                // Delete the department
                this.department.isActive = 0;
                this._departmentsService.deleteDepartment(this.department)
                    .subscribe(() => {
                        // Navigate to the next department if available

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
        this._departmentsService.uploadAvatar(this.department.id, file).subscribe();
    }

    /**
     * Remove the avatar

    removeAvatar(): void
    {
        // Get the form control for 'avatar'
        const avatarFormControl = this.departmentForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the department
        this.department.avatar = null;
    }*/


}

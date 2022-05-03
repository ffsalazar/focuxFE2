import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {fuseAnimations} from '@fuse/animations';
import {FuseAlertType} from '@fuse/components/alert';
import {AuthService} from 'app/core/auth/auth.service';
import {Collaborator} from '../../admin/dashboards/collaborators/collaborators.types';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    collaborator: Collaborator[] = [];
    filteredOptions: Observable<Collaborator[]>;


    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router
    )
    {
        this._authService.getAllColaborators()
            .subscribe( response => this.collaborator = response);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signUpForm = this._formBuilder.group({
                username      : ['', Validators.required],
                password  : ['', Validators.required],
                collaborator: ['', Validators.required],
                collaboratorId: ['', Validators.required],
                agreements: ['', Validators.requiredTrue]
            }
        );

        // filtered option
        this.filteredOptions = this.signUpForm.controls.collaborator.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
        this.signUpForm.controls.collaborator.valueChanges.subscribe(value => console.log(value));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void
    {
        // Do nothing if the form is invalid
        if ( this.signUpForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        this._authService.signUp(
            this.signUpForm.controls.username.value,
            this.signUpForm.controls.password.value,
            this.signUpForm.controls.collaboratorId.value)
            .subscribe(
                (response) => {

                    // Navigate to the confirmation required page
                    this._router.navigateByUrl('/confirmation-required');
                },
                (response) => {

                    console.log(response);
                    // Re-enable the form
                    this.signUpForm.enable();

                    // Reset the form
                    this.signUpNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Something went wrong, please try again.'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }

    collaboratorSelected(collaborator: Collaborator): void {
       this.signUpForm.controls.collaboratorId.setValue(collaborator.id);
    }


    private _filter(value: string): Collaborator[] {
        const filterValue = value.toLowerCase();

        return this.collaborator
            .filter(collaborator =>
                collaborator.name.toLowerCase().includes(filterValue) ||
                collaborator.lastName.toLowerCase().includes(filterValue));
    }
}

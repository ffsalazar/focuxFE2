import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function limitOccupation(maxOccupation: number): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
        const occupation = +control.value;

        if ( occupation > ( 100 - maxOccupation ) ) {
            return {
                limitError: true,
            };
        }   

    }

}
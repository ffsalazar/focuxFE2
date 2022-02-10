import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'contacts',
    templateUrl    : './employeePosition.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeePositionComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}

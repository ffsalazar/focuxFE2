import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'contacts',
    templateUrl    : './businessTypes.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessTypesComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'contacts',
    templateUrl    : './collaborators.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollaboratorsComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}

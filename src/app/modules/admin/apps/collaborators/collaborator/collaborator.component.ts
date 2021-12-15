import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'request',
    templateUrl    : './collaborator.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollaboratorComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}

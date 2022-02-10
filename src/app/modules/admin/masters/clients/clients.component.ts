import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'contacts',
    templateUrl    : './clients.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}

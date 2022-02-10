import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'request',
    templateUrl    : './request.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}

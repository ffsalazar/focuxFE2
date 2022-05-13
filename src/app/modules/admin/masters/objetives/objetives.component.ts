import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'app-objetives',
    templateUrl: './objetives.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjetivesComponent {
    constructor() {}
}

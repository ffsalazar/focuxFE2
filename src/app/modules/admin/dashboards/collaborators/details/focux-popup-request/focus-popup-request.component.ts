import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import {CollaboratorsService} from "../../collaborators.service";


@Component({
  selector: 'app-focux-popup-request',
  templateUrl: './focus-popup-request.component.html',
  styleUrls: ['./focus-popup-request.component.scss']
})
export class FocusPopupRequestComponent implements OnInit, AfterViewInit {

    fromPage!: string;
    fromDialog!: string;

    options = {
	    autoHide: false,
	    scrollbarMinSize: 100
	};

    isOpenModal: BehaviorSubject<Boolean>;
    isOpenModal$ = null

    title: string;

    constructor(
        private requestService: CollaboratorsService,
		public dialogRef: MatDialogRef<FocusPopupRequestComponent>,
		@Inject(MAT_DIALOG_DATA) public data
	) {

		dialogRef.disableClose = true;
    }

    ngOnInit(): void {
        this.title = this.data.title == 'detail' ? 'Detalle de Solicitud' : 'Editar Solicitud';
    }

    ngAfterViewInit() {
        this.isOpenModal$ = this.requestService.isOpenModal$.subscribe(res => {
            if ( res !== null ) {
                this.closeDialog();
            }
        });
    }

    closeDialog() {
        this.dialogRef.close({ event: 'close', data: this.fromDialog });
        this.isOpenModal$.unsubscribe();
    }

}

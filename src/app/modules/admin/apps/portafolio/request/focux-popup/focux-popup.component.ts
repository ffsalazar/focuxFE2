import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { RequestService } from '../request.service';
import { ModalFocuxService } from 'app/core/services/modal-focux/modal-focux.service';
@Component({
  selector: 'app-focux-popup',
  templateUrl: './focux-popup.component.html',
  styleUrls: ['./focux-popup.component.scss']
})
export class FocuxPopupComponent implements OnInit, AfterViewInit {

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
        private requestService: RequestService,
		public dialogRef: MatDialogRef<FocuxPopupComponent>,
        public modalFocuxService: ModalFocuxService,
		@Inject(MAT_DIALOG_DATA) public data
	) {
        
		dialogRef.disableClose = true;  
    }

    ngOnInit(): void {
        this.title = this.data.title == 'detail' ? 'Detalle de Solicitud' : 'Editar Solicitud';
    }

    ngAfterViewInit() {
        this.isOpenModal$ = this.modalFocuxService.isOpenModal$.subscribe(res => {
            if ( res !== null ) {
                this.closeDialog();
            }
        });
    }
  
    closeDialog() {
        this.dialogRef.close({ event: 'close', data: this.fromDialog });
        this.isOpenModal$.unsubscribe();
    }

    styleObject(): Object {
        if (this.data.title === 'evaluation-template'){
            return {height: 'auto',width: '500px'}
        }else{
            return {height: 'auto',width: '1000px'}
        }
       
    }
}

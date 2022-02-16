import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { RequestService } from '../request.service';

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

    constructor(
        private requestService: RequestService,
		public dialogRef: MatDialogRef<FocuxPopupComponent>,
		@Inject(MAT_DIALOG_DATA) public data
	) {
        
		dialogRef.disableClose = true;  
    }

    ngOnInit(): void {
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

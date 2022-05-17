import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { DialogData } from 'app/modules/admin/apps/portafolio/request/request.types';
import { DialogOptions } from 'app/modules/admin/apps/portafolio/request/request.types';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FocuxPopupComponent } from 'app/modules/admin/apps/portafolio/request/focux-popup/focux-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ModalFocuxService {

  constructor(private dialog: MatDialog) { }

  private _isOpenModal: Subject<boolean | null> = new Subject();

  /**
     * Getter for isOpenModal
     */
  get isOpenModal$(): Observable<Boolean> {
    return this._isOpenModal.asObservable();
  }

  closeModal() {
    // Close focuxPopup
    this._isOpenModal.next(false);
  }

  /**
     *
     * @param data
     * @param options
     * @param modalType
     * @returns
     */
  open(data: DialogData, options: DialogOptions = {
    width: 800,
    minHeight: 0,
    height: 200,
    disableClose: true,
  },
    modalType: 1 | 2 = 1
  ): Observable<boolean> {
    const dialogRef: MatDialogRef<FocuxPopupComponent> = this.dialog.open<FocuxPopupComponent, DialogData>(FocuxPopupComponent, {
      data,
    });
    return dialogRef.afterClosed();
  }

}

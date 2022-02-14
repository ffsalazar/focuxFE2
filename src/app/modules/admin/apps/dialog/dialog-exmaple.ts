import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-dialog',
  templateUrl: `<div class="wrapper">
  <h1>Epaaaa</h1>
  <ng-content></ng-content>

  <br />
  <button (click)="copyTagToClipboard()">Copy Content</button>

  <div>
     
  </div>
</div>`
})
export class MyDialogComponent implements OnInit {

  fromPage!: string;
  fromDialog!: string;

  constructor(
  
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MyDialogComponent>,
  ) { }

  ngOnInit(): void {
    this.fromDialog = "I am from dialog land...";
  }
  
  closeDialog() { this.dialogRef.close({ event: 'close', data: this.fromDialog }); }
}
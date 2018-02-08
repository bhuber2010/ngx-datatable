import { Component, Inject, Input, AfterViewInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'remove-encounters-dialog',
  templateUrl: 'removeEncounters.tmpl.html',
  styleUrls: ['./removeEncounters.scss']
})
export class RemoveEncountersDialog implements AfterViewInit {

  constructor(public dialogRef: MatDialogRef<RemoveEncountersDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngAfterViewInit() {}

  cancel(): void {
    this.dialogRef.close()
  }

}

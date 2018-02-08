import { Component, Input, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { without } from 'lodash'

import { RemoveEncountersDialog } from '../remove-encounters/removeEncounters.component'

@Component({
  selector: 'encounters',
  templateUrl: 'encounters.tmpl.html',
  styleUrls: ['./encounters.scss']
})
export class EncountersComponent implements OnInit {

  @Input() visible: boolean
  @Input() rows: any[]

  fullRowSet: any[]
  selected = [];
  removeSuccess: boolean = false

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.fullRowSet = [...this.rows]
    console.log(this)
  }

  openReasonDialog() {
    const dialogRef = this.dialog.open(RemoveEncountersDialog, {
      width: '400px',
      height: '400px',
      position: {
        left: '400',
        top: '50'
      },
      data: {
        reason: 'nothing'
      }
    })
    return dialogRef.afterClosed()
  }

  excludeEncounters() {
    this.openReasonDialog().subscribe(reason => {
      console.log(reason)
      this.removeSuccess = reason ? !!reason.length : false
      if (this.removeSuccess) {
        const remainingRows = without(this.rows, ...this.selected)
        this.rows = [...remainingRows]
      }
    })
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {}

  remove() {
    this.selected = [];
  }

}

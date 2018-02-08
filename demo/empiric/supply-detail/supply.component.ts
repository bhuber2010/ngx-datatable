import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'supply-tree',
  templateUrl: 'supply-tree.tmpl.html',
  styleUrls: [
    './supply-tree.scss'
  ]
})
export class SupplyTreeComponent implements OnInit, AfterViewInit {

  fullRowSet: any[]
  levelsExpanded: string = '0';

  @Input() visible: boolean
  @Input() rows: any[]

  constructor() {

  }

  ngOnInit() {
    this.fullRowSet = [...this.rows]
    console.log(this)
  }

  ngAfterViewInit() {
    this.setLevelsExpanded(this.levelsExpanded)
  }

  getCellClass({ row, column, value }): any {
    // console.log("getCellClass:", value)
    return {
      'out-of-range': value >= 69
    }
  }

  onTreeAction(event: any) {
    console.log(event)
    const index = event.rowIndex;
    const row = event.row;
    if (this.rows[index].treeStatus === 'collapsed') {
      this.rows[index].treeStatus = 'expanded';
    } else {
      this.rows[index].treeStatus = 'collapsed';
    }
    this.rows = [...this.rows];
  }

  expandTree(row: any) {
    console.log(row)
    const rowLevel = row.level
    if (row.treeStatus === 'collapsed') {
        this.rows.forEach(r => {
          if(r.level === rowLevel) r.treeStatus = 'expanded'
        })
    } else {
      this.rows.forEach(r => {
        if(r.level === rowLevel) r.treeStatus = 'collapsed'
      })
    }
    this.rows = [...this.rows]
  }

  setLevelsExpanded(event) {
    console.log(event)
    let selectedLevel = event.value && parseInt(event.value, 10)
    selectedLevel = event.value ? selectedLevel : event // overload to directly set level
    this.rows.forEach(row => {
      if (row.treeStatus !== 'disabled') {
        row.treeStatus = row.level <= selectedLevel ? 'expanded' : 'collapsed'
      }
    })
    this.rows = [...this.rows]
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const filteredRows = this.fullRowSet.filter(row => {
      const rowString = JSON.stringify(row).toLowerCase()
      return rowString.indexOf(val) !== -1 || !val
    })
    console.log('filteredRows:', filteredRows)
    this.rows = filteredRows;
  }

}

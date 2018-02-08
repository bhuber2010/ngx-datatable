import { Component, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'supply-tree',
  templateUrl: 'supply-tree.tmpl.html',
  styleUrls: [
    './supply-tree.scss'
  ]
})
export class SupplyTreeComponent implements AfterViewInit {

  @Input() visible: boolean

  rows = [];
  fullRowSet = [];
  levelsExpanded: string = '0';

  constructor() {
    this.fetch((data) => {
      this.fullRowSet = [...data]
      this.rows = data;
    });
  }

  ngAfterViewInit() {
    this.setLevelsExpanded(this.levelsExpanded)
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/supply_tree.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
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

import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'supply-tree-demo',
  templateUrl: 'supply-tree.tmpl.html',
  styles: [
    '.icon {height: 10px; width: 10px; }',
    '.disabled {opacity: 0.5; }',
    '#level-select { width: 100px; margin: 0; }'
  ],

})
export class SupplyTreeComponent implements AfterViewInit {

  rows = [];
  levelsExpanded: number = 0;


  constructor() {
    this.fetch((data) => {
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

  getCellClass({ row, column, value }) {

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
    let selectedLevel = event.target && parseInt(event.target.value, 10)
    selectedLevel = event.target ? selectedLevel : event // overload to directly set level
    this.rows.forEach(row => {
      if (row.treeStatus != "disabled") {
        row.treeStatus = row.level <= selectedLevel ? 'expanded' : 'collapsed'
      }
    })
    this.rows = [...this.rows]
  }

}

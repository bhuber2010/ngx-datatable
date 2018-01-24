import { Component } from '@angular/core';

@Component({
  selector: 'supply-tree-demo',
  templateUrl: 'supply-tree.tmpl.html',
  styles: [
    '.icon {height: 10px; width: 10px; }',
    '.disabled {opacity: 0.5; }'
  ],

})
export class SupplyTreeComponent {

  rows = [];

  constructor() {
    this.fetch((data) => {
      this.rows = data;
    });
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

}

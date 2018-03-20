import { Component } from '@angular/core';

import { cloneDeep } from 'lodash';

@Component({
  selector: 'client-side-tree-demo',
  template: `
    <div>
      <h3>
        Flex Column Width Distribution
        <small>
          <a href="https://github.com/swimlane/ngx-datatable/blob/master/demo/columns/column-flex.component.ts" target="_blank">
            Source
          </a>
        </small>
      </h3>
      <div>
        <button type="button" (click)="showTree = !showTree">NgIf</button>
      </div>
      <ngx-datatable
        *ngIf="showTree"
        class="material"
        [style.height]="'300px'"
        [columnMode]="'flex'"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="50"
        [scrollbarV]="true"
        [selectionType]="'checkbox'"
        [treeFromRelation]="'manager'"
        [treeToRelation]="'name'"
        [rows]="rows"
        (internalRowsBuilt)="onNewRows($event)"
        (treeAction)="onTreeAction($event)">
        <ngx-datatable-column
          [headerCheckboxable]="true"
          [checkboxable]="true"
          [frozenLeft]="true"
          [sortable]="false"
          [draggable]="false"
          [resizeable]="false"
          [width]="40"
          [minWidth]="30"
          [maxWidth]="40">
        </ngx-datatable-column>
        <ngx-datatable-column name="Name" [flexGrow]="3" [isTreeColumn]="true">
          <ng-template let-value="value" ngx-datatable-cell-template>
            {{value}}
          </ng-template>
          <ng-template ngx-datatable-tree-icon let-tree="treeStatus">
            <i *ngIf="tree==='loading'"
              class="icon datatable-icon-collapse"></i>
            <i *ngIf="tree==='collapsed'"
              class="icon datatable-icon-up"></i>
            <i *ngIf="tree==='expanded'"
              class="icon datatable-icon-down"></i>
            <i *ngIf="tree==='disabled'"
              class="disabled icon datatable-icon-down"></i>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Gender" [cellClass]="getCellClass" [flexGrow]="1">
          <ng-template let-row="row" let-value="value" let-treeAction="treeActionFn" ngx-datatable-cell-template>
            <span (click)="treeAction(row)">{{value}}</span>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Age" [flexGrow]="1">
          <ng-template let-value="value" ngx-datatable-cell-template>
            {{value}}
          </ng-template>
        </ngx-datatable-column>
      </ngx-datatable>
    </div>
  `,
  styles: [
    '.icon {height: 10px; width: 10px; }',
    '.disabled {opacity: 0.5; }'
  ],

})
export class ClientTreeComponent {

  rows = [];
  showTree = false;

  constructor() {
    this.fetch((data) => {
      this.rows = data;
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company_tree.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  onNewRows(event: any) {
    console.log('New Internal Rows:', cloneDeep(event));
  }

  getCellClass({ row, column, value }): any {
    // console.log(cloneDeep(row), cloneDeep(column), value);
    return {
      'is-female': value === 'female'
    };
  }

  onTreeAction(event: any) {
    const index = event.rowIndex;
    const row = event.row;
    if (row.treeStatus === 'collapsed') {
      row.treeStatus = 'expanded';
    } else {
      row.treeStatus = 'collapsed';
    }
    this.rows = [...this.rows];
  }

}

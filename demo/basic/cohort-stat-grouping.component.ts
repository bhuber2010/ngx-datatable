import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'cohort-stat-demo',
  template: `
    <div>
      <h3>
        Cohort Stat Grouping
      </h3>

      <ng-container *ngFor="let cohort of rows">

        <ngx-datatable
          #myTable
          class='material expandable'
          [rows]="[cohort]"
          [groupRowsBy]="'cohort_id'"
          [columnMode]="'flex'"
          [scrollbarH]="false"
          [headerHeight]="0"
          [footerHeight]="0"
          [rowHeight]="undefined"
          [virtualization]="false"
          [limit]="4"
          [groupExpansionDefault]="true">
          <ngx-datatable-group-header [rowHeight]="50" #myGroupHeader (toggle)="onDetailToggle($event)">
            <ng-template let-group="group" let-expanded="expanded" ngx-datatable-group-header-template>
              <div style="padding-left:5px;">
                <a
                  href="#"
                  [class.datatable-icon-right]="!expanded"
                  [class.datatable-icon-down]="expanded"
                  title="Expand/Collapse Group"
                  (click)="toggleExpandGroup(group)">
                  <b>
                  {{group.value[0].description}} : ({{group.value[0].short_name}})
                  </b>
                </a>
              </div>
            </ng-template>
          </ngx-datatable-group-header>
          <ngx-datatable-column name="" prop="">
            <ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row"
            let-group="group">
            <table>
              <tr>
                <td>Cohort Abbrev:</td>
                <td>{{row.short_name}}</td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>Max DOS:</td>
                <td>{{row.stats.max_dos.$date | date:'longDate'}}</td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td># of Encounters:</td>
                <td>{{row.stats.volume}}</td>
              </tr>
              <tr>
                <td>Cohort ID:</td>
                <td>{{row.cohort_id}}</td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>Min DOS:</td>
                <td>{{row.stats.min_dos.$date | date:'longDate'}}</td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>Avg Cost:</td>
                <td>{{row.stats.avg_cost}}</td>
              </tr>
              <tr>
                <td>Service Line:</td>
                <td>{{row.service_line}}</td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
              </tr>
            </table>
            <span>
              <sup>*Stats reflect filtered results</sup>
            </span>
            </ng-template>
          </ngx-datatable-column>
        </ngx-datatable>

        <ng-container *ngFor="let ruleSet of
        [cohort.primary_rule_desc, cohort.secondary_rules_desc, cohort.documentation_rules_desc]">
          <ngx-datatable
            #myTable
            class='material'
            [rows]="ruleSet"
            [columnMode]="'flex'"
            [scrollbarH]="true"
            [headerHeight]="50"
            [footerHeight]="0"
            [rowHeight]="undefined"
            [virtualization]="false"
            [limit]="4">
            <ngx-datatable-column name="Rule" prop="column" frozenLeft="true"
            [headerClass]="'standout-header'" [flexGrow]="2">
              <ng-template ngx-datatable-cell-template let-value="value" let-row="row">
                {{value}}
              </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column name="Operator" prop="operator"
            [headerClass]="'standout-header'" [flexGrow]="1"></ngx-datatable-column>
            <ngx-datatable-column name="Rule Value" prop="rhs"
            [headerClass]="'standout-header'" [flexGrow]="4">
              <ng-template ngx-datatable-header-template let-column="column">
                <span class="datatable-header-cell-wrapper">
                  Value - Description
                </span>
              </ng-template>
              <ng-template ngx-datatable-cell-template let-value="value">
                <table>
                  <tr *ngFor="let ruleValue of value">
                    <td>{{ruleValue.value}}</td>
                    <td>{{ruleValue.description}}</td>
                  </tr>
                </table>
              </ng-template>
            </ngx-datatable-column>
          </ngx-datatable>
        </ng-container>

      </ng-container>

    </div>
  `
})
export class CohortStatComponent {

  @ViewChild('myTable') table: any;


  funder = [];
  calculated = [];
  pending = [];
  groups = [];

  editing = {};
  rows = [];

  constructor() {
    this.fetch((data) => {
      this.rows = data;
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/cohortInfo.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  checkGroup(event, row, rowIndex, group) {
    let groupStatus: string = 'Pending';
    let expectedPaymentDealtWith: boolean = true;

    row.exppayyes = 0;
    row.exppayno = 0;
    row.exppaypending = 0;

    if (event.target.checked)
      if (event.target.value === '0') { // expected payment yes selected
        row.exppayyes = 1;
      } else if (event.target.value === '1') { // expected payment yes selected
        row.exppayno = 1;
      } else if (event.target.value === '2') { // expected payment yes selected
        row.exppaypending = 1;
      }

    if (group.length === 2) { // There are only 2 lines in a group
      // tslint:disable-next-line:max-line-length
      if (['Calculated', 'Funder'].indexOf(group[0].source) > -1 && ['Calculated', 'Funder'].indexOf(group[1].source) > -1) { // Sources are funder and calculated
        // tslint:disable-next-line:max-line-length
        if (group[0].startdate === group[1].startdate && group[0].enddate === group[1].enddate) { // Start dates and end dates match
          for (let index = 0; index < group.length; index++) {
            if (group[index].source !== row.source) {
              if (event.target.value === '0') { // expected payment yes selected
                group[index].exppayyes = 0;
                group[index].exppaypending = 0;
                group[index].exppayno = 1;
              }
            }

            if (group[index].exppayyes === 0 && group[index].exppayno === 0 && group[index].exppaypending === 0) {
              expectedPaymentDealtWith = false;
            }
            console.log('expectedPaymentDealtWith', expectedPaymentDealtWith);
          }
        }
      }
    } else {
      for (let index = 0; index < group.length; index++) {
        if (group[index].exppayyes === 0 && group[index].exppayno === 0 && group[index].exppaypending === 0) {
          expectedPaymentDealtWith = false;
        }
        console.log('expectedPaymentDealtWith', expectedPaymentDealtWith);
      }
    }

    // check if there is a pending selected payment or a row that does not have any expected payment selected
    if (group.filter(rowFilter => rowFilter.exppaypending === 1).length === 0
      && group.filter(rowFilter => rowFilter.exppaypending === 0
                      && rowFilter.exppayyes === 0
                      && rowFilter.exppayno === 0).length === 0) {
      console.log('expected payment dealt with');

      // check if can set the group status
      const numberOfExpPayYes = group.filter(rowFilter => rowFilter.exppayyes === 1).length;
      const numberOfSourceFunder = group.filter(
          rowFilter => rowFilter.exppayyes === 1 && rowFilter.source === 'Funder').length;
      const numberOfSourceCalculated = group.filter(
          rowFilter => rowFilter.exppayyes === 1 && rowFilter.source === 'Calculated').length;
      const numberOfSourceManual = group.filter(
          rowFilter => rowFilter.exppayyes === 1 && rowFilter.source === 'Manual').length;

      console.log('numberOfExpPayYes', numberOfExpPayYes);
      console.log('numberOfSourceFunder', numberOfSourceFunder);
      console.log('numberOfSourceCalculated', numberOfSourceCalculated);
      console.log('numberOfSourceManual', numberOfSourceManual);

      if (numberOfExpPayYes > 0){
        if (numberOfExpPayYes === numberOfSourceFunder){
          groupStatus = 'Funder Selected';
        } else if (numberOfExpPayYes === numberOfSourceCalculated){
          groupStatus = 'Calculated Selected';
        } else if (numberOfExpPayYes === numberOfSourceManual) {
          groupStatus = 'Manual Selected';
        } else {
          groupStatus = 'Hybrid Selected';
        }
      }

    }

    group[0].groupstatus = groupStatus;
  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  toggleExpandGroup(group) {
    console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

}

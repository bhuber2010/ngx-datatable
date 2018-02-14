import { Component, Injectable, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import * as WebFont from 'webfontloader'

import { EncountersComponent } from './encounters/encounters.component'

@Injectable()
@Component({
  selector: 'empiric',
  templateUrl: 'empiric.tmpl.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./theme.scss', './empiric.scss']
})
export class EmpiricComponent {

  encounters: any[] = []
  supplyTree: any[] = []
  showEncounters: boolean = false
  showSupplyDetail: boolean = false

  @ViewChild(EncountersComponent)
  private encountersComponent: EncountersComponent

  constructor(private http: HttpClient) {
    WebFont.load({
      google: {
        families: ['Material Icons']
      }
    })
    this.getEncounters()
    this.getSupplyDetail()
  }

  getEncounters() {
    this.http.get<any[]>(`assets/data/encounters.json`)
      .subscribe(
        data => {
          console.log(data)
          this.encounters = [...data]
        },
        error => console.log(error)
      )
  }

  getSupplyDetail() {
    this.http.get<any[]>(`assets/data/supply_tree.json`)
      .subscribe(
        data => this.supplyTree = [...data],
        error => console.log(error)
      )
  }

  removeEncounters() {
    this.encountersComponent.excludeEncounters()
  }

  showEncountersTable() {
    this.showEncounters = !this.showEncounters
  }

  showSupplyDetailTable() {
    this.showSupplyDetail = !this.showSupplyDetail
  }

}

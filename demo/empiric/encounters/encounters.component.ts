import { Component, Input } from '@angular/core';

@Component({
  selector: 'encounters',
  templateUrl: 'encounters.tmpl.html',
  styleUrls: ['./encounters.scss']
})
export class EncountersComponent {

  @Input() visible: boolean
  
  rows = [];
  fullRowSet = [];
  selected = [];

  constructor() {
    this.fetch((data) => {
      this.fullRowSet = [...data]
      this.rows = data;
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/encounters.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }

  remove() {
    this.selected = [];
  }

}

import {Component, OnInit, ViewChild} from '@angular/core';
// import {CyclicBComponent} from '../cyclic-b/cyclic-b.component';

@Component({
  selector: 'app-cyclic-a',
  templateUrl: './cyclic-a.component.html',
  styleUrls: ['./cyclic-a.component.scss']
})
export class CyclicAComponent implements OnInit {

  // @ViewChild(CyclicBComponent) c!: CyclicAComponent;
  constructor() { }

  ngOnInit(): void {
  }

}

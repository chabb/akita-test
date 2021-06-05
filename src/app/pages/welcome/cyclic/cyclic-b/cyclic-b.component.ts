import {Component, OnInit, ViewChild} from '@angular/core';
import {CyclicAComponent} from '../cyclic-a/cyclic-a.component';

@Component({
  selector: 'app-cyclic-b',
  templateUrl: './cyclic-b.component.html',
  styleUrls: ['./cyclic-b.component.scss']
})
export class CyclicBComponent implements OnInit {

  //
  @ViewChild(CyclicAComponent) c!: CyclicAComponent;
  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-filter',
  templateUrl: './progress-filter.component.html',
  styleUrls: ['./progress-filter.component.scss']
})
export class ProgressFilterComponent implements OnInit {

  constructor(private readonly q) { }

  ngOnInit(): void {
  }

}

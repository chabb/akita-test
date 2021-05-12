import { Component, OnInit } from '@angular/core';
import {UserQueryService} from '../../shared/state/users-query.service';
import { NzMarks } from 'ng-zorro-antd/slider';


@Component({
  selector: 'app-progress-filter',
  templateUrl: './progress-filter.component.html',
  styleUrls: ['./progress-filter.component.scss']
})
export class ProgressFilterComponent implements OnInit {

  readonly progressControl = this.query.searchByProgressControl();
  constructor(private readonly query: UserQueryService) { }

  readonly marks: NzMarks = {
    0: '0%',
    20: '20%',
    40: '40%',
    60: '60%',
    80: '80%',
    100: '100%'
  };

  ngOnInit(): void {
  }

}

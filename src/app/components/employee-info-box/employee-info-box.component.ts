import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-employee-info-box',
  templateUrl: './employee-info-box.component.html',
  styleUrls: ['./employee-info-box.component.scss']
})
export class EmployeeInfoBoxComponent implements OnInit {
  @Input() employee: any;
  constructor() { }

  ngOnInit(): void {
  }

}

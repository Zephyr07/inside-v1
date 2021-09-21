import {Component, Input, OnInit} from '@angular/core';

import {MOIS} from "../../services/contants";
@Component({
  selector: 'app-employee-modal',
  templateUrl: './employee-modal.component.html',
  styleUrls: ['./employee-modal.component.scss']
})
export class EmployeeModalComponent implements OnInit {
  @Input() employee:any;
  MOIS = MOIS;
  constructor() { }

  ngOnInit(): void {
  }

}

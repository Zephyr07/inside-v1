import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-empty-data',
  templateUrl: './empty-data.component.html',
  styleUrls: ['./empty-data.component.scss']
})
export class EmptyDataComponent implements OnInit {
  @Input() title: any;
  constructor() { }

  ngOnInit(): void {
  }

}

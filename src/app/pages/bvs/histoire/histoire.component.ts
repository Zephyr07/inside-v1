import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";

@Component({
  selector: 'app-histoire',
  templateUrl: './histoire.component.html',
  styleUrls: ['./histoire.component.scss']
})
export class HistoireComponent implements OnInit {
  public show = true;
  public history :any = [];
  constructor(
    private api : ApiProvider
  ) {
    this.show = true;
    this.getHistories();
  }

  ngOnInit(): void {
  }

  getHistories(){
    this.api.Contents.getList({type:'history'}).subscribe((v:any)=>{
      this.history = v;
      this.show = false;
    }, (e:any)=>{
      this.show = false;
    })
  }


}

import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";

@Component({
  selector: 'app-ceo',
  templateUrl: './ceo.component.html',
  styleUrls: ['./ceo.component.scss']
})
export class CeoComponent implements OnInit {
  public show = true;
  public ceo :any = [];
  constructor(
    private api : ApiProvider
  ) {
    this.getCeoMessage();
  }

  ngOnInit(): void {
  }

  getCeoMessage(){
    this.api.Contents.getList({type:'ceo'}).subscribe((v:any)=>{
      this.show = false;
      this.ceo = v[0];
    }, (e:any)=>{
      this.show = false;
    })
  }

}

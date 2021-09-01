import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-add-entity',
  templateUrl: './add-entity.component.html',
  styleUrls: ['./add-entity.component.scss']
})
export class AddEntityComponent implements OnInit {
  public name = "";
  public address = "";
  public title = "Nouvelle entité";
  private entity:any;
  constructor(
    public route: ActivatedRoute,
    private api:ApiProvider

  ) {
    const id:any = this.route.snapshot.paramMap.get('id');
    if(id !== undefined && id != null){
      this.getEntity(parseInt(id));
      this.title = "Modification";
    }
  }

  ngOnInit(): void {
  }

  saveEntity(){
    if(this.name !== undefined && this.name !== "" && this.address !== undefined && this.address !== "") {
      if(this.entity !== undefined && this.entity !== null){
        this.entity.id = this.entity.body.id;
        this.entity.name = this.name;
        this.entity.address = this.address;
        this.entity.put().subscribe((d:any)=>{
          alert("Entité modifiée");
        })
      } else {
        this.api.Entities.post({name:this.name,address:this.address}).subscribe((d:any)=>{
          alert("Entité enregistrée");
        })
      }

    }
  }

  getEntity(id:number){
    this.api.Entities.get(id).subscribe((d:any)=>{
      this.entity = d;
      this.name = d.body.name;
      this.address = d.body.address
    })
  }
}

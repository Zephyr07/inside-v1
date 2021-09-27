import { Component, OnInit } from '@angular/core';

import OrgChart from "@balkangraph/orgchart.js";
import {ApiProvider} from "../../../providers/api/api";

@Component({
  selector: 'app-organigramme',
  templateUrl: './organigramme.component.html',
  styleUrls: ['./organigramme.component.scss']
})
export class OrganigrammeComponent implements OnInit {
  constructor(
    private api: ApiProvider
  ){

  }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(){
    const opt = {
      should_paginate: true,
      per_page:150,
      _includes: 'direction.entity'
    };

    this.api.Employees.getList(opt).subscribe((d:any)=>{
      const tree = document.getElementById('tree');
      if (tree) {
        // @ts-ignore
        var chart = new OrgChart(tree, {
          nodeBinding: {
            field_0: "Nom",
            field_1: "Fonction",
            img_0: "img"
          },
        });
        let x: any = [];
        d.forEach((v:any)=>{
          v.pid = v.sup_id;
          v.img = v.image;
          //v.direction = v.direction.name;
          let a = v.first_name;
          if(v.last_name!=null){
            a = v.last_name + ' '+v.first_name
          }
          x.push({
            id:v.id,
            Nom: a,
            Fonction:v.title,
            'Téléphone':this.api.formarPrice(v.phone),
            'Fixe':this.api.formarPrice(v.ip_phone),
            img:v.image,
            pid : v.sup_id,
            Direction: v.direction.name,
            'Entité': v.direction.entity.name
          })
        });
        chart.load(x);
      }
      //{ id: 7, pid: 3, name: "Fran Parsons", title: "Developer", img: "https://cdn.balkan.app/shared/8.jpg" }
    })
  }
}

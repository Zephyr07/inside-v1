import { Component, OnInit } from '@angular/core';
import {TreeNode} from "primeng/api";

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
      per_page:10,
      _includes: 'direction.entity'
    };

    this.api.Employees.getList(opt).subscribe((d:any)=>{
      const tree = document.getElementById('tree');
      if (tree) {
        // @ts-ignore
        var chart = new OrgChart(tree, {
          nodeBinding: {
            field_0: "first_name",
            field_1: "title",
            img_0: "img"
          },
        });
        let x: any = [];
        d.forEach((v:any)=>{
          v.pid = v.sup_id;
          v.img = v.image;
          v.direction = v.direction.name;
          x.push(v)
        });
        chart.load(x);
      }
      //{ id: 7, pid: 3, name: "Fran Parsons", title: "Developer", img: "https://cdn.balkan.app/shared/8.jpg" }
    })
  }
}

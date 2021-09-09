import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiProvider} from "../../providers/api/api";
import * as _ from "lodash";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  public show_post = true;
  public show = false;
  public user:any;
  public post :any= {ratings:[],posts:[],employee:{}};
  public posts:any =[];
  public imageSrc ="";
  public closeResult ="";
  public content ="";
  private file_selected = false;
  public image = new FormData();
  constructor(
    private api: ApiProvider,
    private modalService: NgbModal,
    public route: ActivatedRoute
  ) {
    // @ts-ignore
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getPosts();
  }

  ngOnInit(): void {
  }

  getPosts(){
    const opt = {
      should_paginate:false,
      //post_id: undefined,
      _sort:'created_at',
      _sortDir:'desc',
      _includes:'employee,posts.employee,ratings',
    };
    this.api.Posts.getList(opt).subscribe((p:any)=>{
      p.forEach((v:any)=>{
        if(v.post_id==undefined || v.post_id==null){
          v.posts = _.orderBy(v.posts, 'updated_at').reverse();
          v.comment = _.filter(p,{post_id:v.id}).length;
          p.commentaire = "";
          v.like = _.find(v.ratings, {employee_id: this.user.employee.id}) != undefined;
          v.show = false;
          this.posts.push(v);
        }
      });
      this.show_post = false;
    })
  }


  deleteComment(post:any,p:any){
    const x = _.find(post.posts,p);
    post.posts.splice(post.posts.indexOf(x),1);
    this.api.Posts.get(p.id).subscribe((e:any)=>{
      e.id = e.body.id;
        e.remove();
    }, (e:any)=>{
      console.log(e);
      p.show = false;
    })
  };
  saveComment(p:any){
    p.show = true;
    const opt = {
      content : p.commentaire,
      employee_id: this.user.employee.id,
      post_id: p.id
    };
    this.api.Posts.post(opt).subscribe((d:any)=>{
      d.body.employee = this.user.employee;
      p.posts.push(d.body);
      p.posts = _.orderBy(p.posts,'updated_at').reverse();
      p.commentaire = "";
      p.show = false;
    }, (e:any)=>{
      console.log(e);
      p.show = false;
    })

  }

  saveRating(p:any){
    if(!p.like){
      // ajout
      p.like = true;
      p.ratings.push({id:0,employee_id:this.user.employee.id,post_id:p.id});
      this.api.Ratings.post({employee_id:this.user.employee.id,post_id:p.id}).subscribe((d:any)=>{

      }, (e:any)=>{
        console.log(e);
      })
    } else {
      p.like = false;
      const x = _.find(p.ratings,{employee_id:this.user.employee.id,post_id:p.id});
      p.ratings.splice(p.ratings.indexOf(x),1);
        //suppression
      this.api.Ratings.getList({employee_id:this.user.employee.id,post_id:p.id}).subscribe((v:any)=>{
        v[0].remove().subscribe(()=>{
        }, (e:any)=>{
          console.log(e);
        } )
      })
    }
  }

  savePost(){
    this.show = true;
    this.api.Posts.post({content:this.content,employee_id:this.user.employee.id}).subscribe((e:any)=>{
      // enretistrement de l'image
      if(this.file_selected){
        this.image.append('_method', 'PUT');
        this.api.restangular.all('posts/' + e.body.id).customPOST(this.image, undefined, undefined, {'Content-Type': undefined}).subscribe((d:any) => {
          //console.log('ok', d);
          alert("Publié");
          this.show = false;
          this.content = "";
          this.imageSrc = "";
          this.image = new FormData();
        }, (e:any)=>{
          console.log(e);
          this.show = false;
        });
      } else {
        // pas d'image on ne fait rien
        this.show = false;
      }
    })
  }


  onSelectFile(event:any) {
    this.file_selected = true;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    //this.imageSrc = reader.result as string;
    this.image.append('image', event.target.files[0], event.target.files[0].name);
    reader.onload = () => {
      this.imageSrc = reader.result as string;
    };
  }

  openModal(){
    // @ts-ignore
    document.getElementById('btnModal').click();
  }

  open(content:any) {
    this.modalService.open(content, {centered: true,scrollable: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}

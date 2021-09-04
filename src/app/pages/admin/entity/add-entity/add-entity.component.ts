import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-add-entity',
  templateUrl: './add-entity.component.html',
  styleUrls: ['./add-entity.component.scss']
})
export class AddEntityComponent implements OnInit {
  public name = "";
  public show = false;
  public show_loading = false;
  show_spinnner = false;
  public message_toast = "";
  public address = "";
  public success_title = "";
  closeResult = '';
  public title = "Nouvelle entité";
  private entity:any;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private modalService: NgbModal,
    private api:ApiProvider

  ) {
    const id:any = this.route.snapshot.paramMap.get('id');
    if(id !== undefined && id != null){
      this.show_spinnner = true;
      this.getEntity(parseInt(id));
      this.title = "Modification";
    }
  }

  ngOnInit(): void {
  }

  saveEntity(){

    if(this.checkForm()) {
      this.show_loading = true;
      if(this.entity !== undefined && this.entity !== null){
        this.entity.id = this.entity.body.id;
        this.entity.name = this.name;
        this.entity.address = this.address;
        this.entity.put().subscribe((d:any)=>{
          this.openModal("Entité "+this.name +" mise à jour");

        })
      } else {
        this.api.Entities.post({name:this.name,address:this.address}).subscribe((d:any)=>{
          this.openModal("Entité "+this.name +" créée");
        })
      }

    }
  }

  getEntity(id:number){
    this.api.Entities.get(id).subscribe((d:any)=>{
      this.entity = d;
      this.name = d.body.name;
      this.address = d.body.address;
      this.show_spinnner = false;
    })
  }

  checkForm() {
    if(this.name==undefined || this.name==null || this.name==""){
      this.message_toast = "Nom absent";
      this.show = true;
      return false;
    } else if(this.address==undefined || this.address==null || this.address == ""){
      this.message_toast = "Adresse absente";
      this.show = true;
      return false;
    } else {
      this.show = false;
      return true;
    }
  }

  openModal(title:string){
    this.show_loading = false;
    this.success_title = title;
    // @ts-ignore
    document.getElementById('btnModal').click();
  }

  open(content:any) {
    this.modalService.open(content, {size: 'sm', centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    this.router.navigate(['/admin/list-entity']);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}

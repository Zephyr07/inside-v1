import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ApiProvider} from "../../../../providers/api/api";

@Component({
  selector: 'app-add-content',
  templateUrl: './add-content.component.html',
  styleUrls: ['./add-content.component.scss']
})
export class AddContentComponent implements OnInit {

  public title = "";
  public description = "";
  public show = false;
  public show_loading = false;
  show_spinnner = false;
  public message_toast = "";
  public success_title = "";
  closeResult = '';
  private file_selected = false;
  public type ="";
  public imageSrc ="";
  public image = new FormData();
  public titre = "Nouveau contenu";
  private content:any;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private modalService: NgbModal,
    private api:ApiProvider

  ) {
    const id:any = this.route.snapshot.paramMap.get('id');
    if(id !== undefined && id != null){
      this.show_spinnner = true;
      this.getContent(parseInt(id));
      this.titre = "Modification";
    }
  }

  ngOnInit(): void {
  }

  saveContent(){
    if(this.checkForm()) {
      this.show_loading = true;
      if(this.content !== undefined && this.content !== null){
        this.content.id = this.content.body.id;
        this.content.title = this.title;
        this.content.description = this.description;
        this.content.type = this.type;
        this.content.put().subscribe((d:any)=>{
          // traitement du fichier
          if(this.file_selected){
            // update du fichier
            this.image.append('_method', 'PUT');
            this.api.restangular.all('contents/' + d.body.id).customPOST(this.image, undefined, undefined, {'Content-Type': undefined}).subscribe((d:any) => {
              //console.log('ok', d);
              this.openModal("Contenu "+this.title + " mis à jour");
            }, (e:any)=>{
              console.log(e);
            });
          } else {
            this.openModal('Contenu '+this.title+' mis à jour');
          }
        })
      } else {
        this.api.Contents.post({title:this.title,description:this.description, type: this.type}).subscribe((d:any)=>{
          // traitement du fichier
          if(this.file_selected){
            // update du fichier
            this.image.append('_method', 'PUT');
            this.api.restangular.all('contents/' + d.body.id).customPOST(this.image, undefined, undefined, {'Content-Type': undefined}).subscribe((d:any) => {
              //console.log('ok', d);
              this.openModal("Contenu "+this.title + " créé");
            }, (e:any)=>{
              console.log(e);
            });
          }
        })
      }

    }
  }

  getContent(id:number){
    this.api.Contents.get(id).subscribe((d:any)=>{
      this.content = d;
      this.title = d.body.title;
      this.description = d.body.description;
      this.imageSrc = d.body.image;
      this.type = d.body.type;
      this.show_spinnner = false;
    })
  }

  onSelectFile(event:any) {
    this.file_selected = true;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    //this.imageSrc = reader.result as string;
    this.image.append('image', event.target.files[0], event.target.files[0].name);
    reader.onload = () => {
      console.log('ze');
      this.imageSrc = reader.result as string;
    };
  }

  checkForm() {
    if(this.title==undefined || this.title==null || this.title==""){
      this.message_toast = "Titre absent";
      this.show = true;
      return false;
    } else if(this.description==undefined || this.description==null || this.description == ""){
      this.message_toast = "Description absente";
      this.show = true;
      return false;
    } else if(this.type==undefined || this.type==null || this.type == ""){
      this.message_toast = "Type absent";
      this.show = true;
      return false;
    } else if(this.imageSrc==undefined || this.imageSrc==null || this.imageSrc == ""){
      this.message_toast = "Image absente";
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
    this.router.navigate(['/admin/list-content']);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}

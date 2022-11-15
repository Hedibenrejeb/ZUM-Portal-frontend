import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgForm } from '@angular/forms';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from 'src/app/core/services/task.service';
import { Task } from 'src/app/core/models/task.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/auth.models';
import { ProjectService } from 'src/app/core/services/project.service';
import { Project } from '../../projects/project.model';
import { Projet } from 'src/app/core/models/projet';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { map } from 'rxjs/operators';
import{DatePipe, formatDate} from '@angular/common'
import { Role } from 'src/app/core/enum/Role';


@Component({
  selector: 'app-createtask',
  templateUrl: './createtask.component.html',
  styleUrls: ['./createtask.component.scss'],
  providers: [DatePipe]

}
)


/**
 * Tasks-create component
 */
export class CreatetaskComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;

  public Editor = ClassicEditor;
  // form = new FormGroup({
  //   member: new FormArray([
  //     new FormControl(''),
  //   ]),
  // });

  hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;
  hidden: boolean;
  selected: any;



  members:User[];
 public addTask=new Task();
project:Projet;
description="Content of the editor"
affectedTo:User;
// project="nesrine"
projectsSu:Projet[]=[];
datetask:any;
tasks:Task[]; 
userActuel:User;
projects:Projet[] ;
d1t:string;
projectId:number;
disablemember:boolean;


  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  @ViewChild('dp', { static: true }) datePicker: any;

  /**
   * Returns the form field value
   */
  // get member(): FormArray { return this.form.get('member') as FormArray; }

  /**
   * Add the member field in form
   */
  // addMember() {
  //   this.member.push(new FormControl());
  // }

  // /**
  //  * Onclick delete member from form
  //  */
  // deleteMember(i: number) {
  //   this.member.removeAt(i);
  // }

  constructor(private calendar: NgbCalendar,private taskServ:TaskService,private authServ:AuthenticationService
    ,private projServ:ProjectService,private datePipe: DatePipe) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Tasks' }, { label: 'Create Task', active: true }];

    this.hidden = true;
    this.disablemember=true
    this.members=this.authServ.getUsersFromLocalCache().filter(u=>u.role=="SU");

    console.log ( 'members from local storage',this.members)
    this.userActuel=this.authServ.getUserFromLocalCache()
    console.log(this.userActuel)
    this.getProjects()


    var d=new Date()
    console.log(d.getMonth()+1)
    console.log(d.getDate())


  }

  public getTasks(): void {
    this.taskServ.listTask().subscribe(
      (response:Task[]) => {

        console.log("tasks");
        this.tasks = response;
        console.log(this.tasks)

      }, (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
      }
    )
    
  }


//modifier model de que il est prêt
public getProjects(): void {

if(this.isSimpleUser){
  this.projServ.listProjectByAffectedTo(this.userActuel.id).subscribe((response:Projet[])=>{
    console.log("affected to id ")
    console.log(response['results'])
    this.projects=response['results']
  }, (errorResponse: HttpErrorResponse) => {
    console.log(errorResponse);
  }
  
  ) }else{



  this.projServ.listProject().subscribe(
    (response: any[]) => {
    //  console.log(response['results'])
     this.projects = response['results'];
   }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
    }
  )}
  } 




selectedProject(project:any){

this.projectId=project.id
if(this.projectId!=null){ 
  this.disablemember=false 
}
if(this.isManager){
this.members=this.project.assigned_to
//console.log("liste user from project",this.members)
}
}



descriptionTraiter(){
//  console.log("clean data ")
  let str=this.description.replace('<p>','')
  let str2=str.replace('</p>','')
  this.description= str2.replace('&nbsp;',' ')
  //console.log(this.description)
}


  public addNewTask(newTaskForm: Task): void {
  //console.log("newTaskForm")
  this.descriptionTraiter();
  this.fixingCode(newTaskForm);
 
      this.taskServ.addTask(this.addTask).subscribe((response: Task) => {
        console.log(response)
             
              console.log("added fonction ")
             this.selected=null;
             this.description="Content of the editor"
             this.project=null;
             this.disablemember=true
             console.log(this.disablemember)
              // this.dateFin = null;
      
            },
              (errorResponse: HttpErrorResponse) => {
                console.log(errorResponse);
               this.getTasks(); 
      
              }
            )
          
   
    } 
    
    
/**  Traitement     ***/
fixingCode(newTask:Task){
  console.log("fixing")
  console.log(newTask)
  console.log(newTask.creator.id , newTask.affectedTo.id)
  let datecreate= new Date();
  /**** form.value ******/
  this.addTask.name=newTask.name;
  this.addTask.creator=newTask.creator.id;
 
  this.addTask.affectedTo=newTask.affectedTo.id;
  this.addTask.description=this.description;
  this.addTask.project=newTask.project.id;
  this.addTask.status=newTask.status;

  /********date *******/
 let dt=formatDate(datecreate,'yyyy-MM-dd','en_US')
 console.log("date creation")
 console.log(dt)
 this.addTask.createdate=dt;
  /********* */
  
  console.log("testing date ")
   let d1,d2;
   d1=this.datetask[0];
   d2=this.datetask[1];

   console.log("d1,d2",d1,d2)
   let date1 =d1.split("/",3) //[19 ,10, 2022 ]
   let date2 =d2.split("/",3)

   console.log("date:",date1,date2)

  // d1 = date1[1] +"/" + date1[0]  +"/" + date1[2]
  // d2 = date2[1] +"/" + date2[0]  +"/" + date2[2]
   console.log("datestart",d1,"dateFin",d2)

  let start=formatDate(d1,'yyyy-MM-dd','en_US')
  let end=formatDate(d2,'yyyy-MM-dd','en_US')
  

  this.addTask.startdate=start;
  
  this.addTask.enddate=end; 


 console.log(this.addTask)



}







  /**
   * on date selected
   * @param date date object
   */
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    } else if (this.fromDate && !this.toDate && date.after(this.fromNGDate)) {
      this.toNGDate = date;
      this.toDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
      this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();

      this.datetask=this.selected.split("-",2)

     // console.log(this.datetask[0])
      console.log(this.description)

      this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });

      this.fromDate = null;
      this.toDate = null;
      this.fromNGDate = null;
      this.toNGDate = null;



    } else {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';


    }
  }




  private getUserRole():string{
    return this.authServ.getUserFromLocalCache().role;
  }
  
  public get isAdmin():boolean{
    return this.getUserRole()=== Role.ADMIN;
  }
  
  public get isManager():boolean{
    return this.isAdmin ||this.getUserRole()=== Role.MANAGER;
  }
  
  public get isSimpleUser():boolean{
    return this.getUserRole()==Role.SIMPLEUSER;
  }
  

  public get isAny():boolean{
    return this.isAdmin ||this.isManager|| this.isSimpleUser;
  }
  




  getProjectSU(){
    this.projects 
       /*   if(this.userActuel.role=="SU"){ */
      /*  let i=[];
        this.projects.map((item)=>{
         if(item.assigned_to.find(u=>u.id==this.userActuel.id)){
          i.push(this.projects.indexOf(item))
         }  
  
         for(let j=0;j<i.length;j++){ this.projectsSu.push(this.projects[j])}
     }) */
  
  
  
  }







  /**
   * Is hovered over date
   * @param date date obj
   */
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }

  /**
   * @param date date obj
   */
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }

  /**
   * @param date date obj
   */
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }

}

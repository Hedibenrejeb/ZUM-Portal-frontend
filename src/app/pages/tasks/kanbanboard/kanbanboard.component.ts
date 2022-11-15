import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { TaskService } from 'src/app/core/services/task.service';
import { Task } from 'src/app/core/models/task.models';
import { CustomHttpResponse } from 'src/app/core/models/custom-http-response';
import { tasks } from './data';
import { Role } from 'src/app/core/enum/Role';
import { Taskk } from './kanabn.model';
import { alphaNumerate } from 'chartist';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project.service';
import { Projet } from 'src/app/core/models/projet';

@Component({
  selector: 'app-kanbanboard',
  templateUrl: './kanbanboard.component.html',
  styleUrls: ['./kanbanboard.component.scss']
})

/**
 * Kanbanboard Component
 */
export class KanbanboardComponent implements OnInit {
  tasks:Task[]=[]; 

  taskss:Task[]; 

  tasksInprogress: Task[];
  tasksCompleted: Task[];
  tasksUnstarted: Task[];
  tasksCancel: Task[];

public selectedTask=new Task();
userActuel:User;
  upcomingTasks: Taskk[];
  inprogressTasks: Taskk[];
  completedTasks: Taskk[];
  // bread crumb items
  breadCrumbItems: Array<{}>;
id:number;
  constructor(private taskServ:TaskService,private router:Router, private projServ:ProjectService,private authServ:AuthenticationService,private modalService: NgbModal,private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.userActuel=this.authServ.getUserFromLocalCache();
    console.log(this.userActuel)
    this.getTasks();
      
  }

  public getTasks(): void {
    this.taskServ.listTask().subscribe(
      (response:Task[]) => {
           console.log("refresh after delete")
   console.log(response)
           this.tasks=response.filter(t=>t.affectedTo.id==this.userActuel.id);
           console.log(this.tasks) 
         this.tasksInprogress=this.tasks.filter(t=>t.status=="INPROGRESS");
         this.tasksCompleted=this.tasks.filter(t=>t.status=="COMPLETED");
         this.tasksUnstarted=this.tasks.filter(t=>t.status=="UNSTARTED");
         this.tasksCancel=this.tasks.filter(t=>t.status=="CANCEL");
         
         console.log("tasks Progress",this.tasksInprogress )
         console.log("tasks completed",this.tasksCompleted )
         console.log("tasks unstarted",this.tasksUnstarted )
         console.log("tasks cancel",this.tasksCancel )   
           
      }, (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
      }
    )

    
  }


 

  onSelectTask(task:Task){
    this.selectedTask=task
    console.log( "selected task ",this.selectedTask)
  }
  onEditTask(task:Task){
    this.id = task.id;
    console.log("id of task selected ", this.id)
    this.router.navigate(['/p/tasks/updateTask/', this.id])
  console.log("on edit task ")
}
   /**
   * Open scroll modal
   * @param scrollDataModal scroll modal data
   */
   detailsModal(scrollDataModal: any) {
      this.modalService.open(scrollDataModal, { scrollable: true });
    }


  deleteMD(deleteDataModal: any) {
    this.modalService.open(deleteDataModal, { size: 'lg', centered: true });
  }

  onDeleteTask(idtask:number){

    console.log( "deleted task ",idtask)
    console.log(idtask)
    this.taskServ.deleteTask(idtask).subscribe(()=>{
    this.getTasks();

    console.log("delete succussfuly")
  
    this.clickButton('delete-close');


    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
    console.log(errorResponse.error.message);
    this.clickButton('delete-close');

    })


  }


  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
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
  




  public traitementList(){
    /* 
            let i=[]
            this.taskss.map((item)=>{i.push(item.id)} )
            console.log(this.taskr)
            console.log(this.taskss)
            let k=[]
            for(let j=0;j<i.length;j++){ k.push(this.taskr.indexOf(this.taskr.find(f=>f.id==i[j])))}
            for(let j of k ){ this.tasks.push(this.taskr[j])}
            console.log(this.tasks) */
  
 }



 public getTaskuser(){
  this.taskServ.listTaskByAffectedTo(this.userActuel.id).subscribe((response:Task[])=>{
    console.log("affected to id ")
    this.taskss = response['results'];
    console.log(this.taskss)

    
  }, (errorResponse: HttpErrorResponse) => {
    console.log(errorResponse);
  }
  )
}
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Projet } from 'src/app/core/models/projet';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { TaskService } from 'src/app/core/services/task.service';
import { Task } from 'src/app/core/models/task.models';

import { taskChart, tasks } from './data';

import { ChartType, Tasklist } from './list.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

/**
 * Tasks-list component
 */
export class ListComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;

  submitted = false;
  formData: FormGroup;

  taskChart: ChartType;

  upcomingTasks: Tasklist[];
  inprogressTasks: Tasklist[];
  completedTasks: Tasklist[];
  myFiles = [];
 id:number;



  tasksInprogress: Task[];
  tasksCompleted: Task[];
  tasksUnstarted: Task[];
  tasksCancel: Task[];


  projectid:number;
  taskid:Task[]; 
  selectedProj:any;
  public selectTask=new Task();

  constructor(private modalService: NgbModal, private router:Router,private taskServ:TaskService,private projServ:ProjectService,private formBuilder: FormBuilder,private authServ:AuthenticationService,private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Tasks' }, { label: 'Task List', active: true }];

    this.formData = this.formBuilder.group({
      name: ['', [Validators.required]],
      file: new FormControl('', [Validators.required]),
      taskType: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });

    this._fetchData();




     //recupere project id
     console.log("pamaMap")
     this.activateRoute.paramMap.subscribe((params:ParamMap)=>
     {       
       if(params.get('id')!=null){
           this.projectid =parseInt(params.get('id'));
 
           this.getTasksbyIdProject(this.projectid);
           this.selectedProj=this.getProjectById(this.projectid) 
 
              } 
      
     })
  }

 updateTask(i: number) {
    this.id = i;
    console.log("id of task selected ", this.id)
    this.router.navigate(['/p/tasks/updateTask/', this.id])
  }

  onSelectTask(task:Task){
    this.selectTask=task
    console.log( "selected task ",this.selectTask.id)
    //  this.detailTask(this.selectTask.id)
  }




   /**
   * Open scroll modal
   * @param scrollDataModal scroll modal data
   */
    detailsModal(scrollDataModal: any) {
      this.modalService.open(scrollDataModal, { scrollable: true });
    }


 
  
detailTask(task:Task, scrollDataModal: any){
  // this.selectTask=task

  this.taskServ.taskByid(task.id).subscribe((task:Task)=>{
    console.log("task details")
    console.log(task)
    this.selectTask=task
    if(task.creator.firstname){
     this.modalService.open(scrollDataModal, { scrollable: true });
    }

  }, (errorResponse: HttpErrorResponse) => {
    console.log(errorResponse);
  console.log(errorResponse.error.message);
  })
}








  deleteMD(deleteDataModal: any) {
    this.modalService.open(deleteDataModal, { size: 'lg', centered: true });
  }

  onDeleteTask(idtask:number){

    console.log( "deleted task ",idtask)
    console.log(idtask)
    this.taskServ.deleteTask(idtask).subscribe(()=>{
      this.getTasksbyIdProject(this.projectid);

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

// for param Map

public getTasksbyIdProject(idproj:number){ this.taskServ.listTaskByProject(idproj).subscribe((response:Task[])=>{
  console.log("tasks by project")
  //console.log(response)
  this.taskid=response
  
  //console.log(this.taskid)
  this.tasksInprogress=this.taskid.filter(t=>t.status=="INPROGRESS");
  this.tasksCompleted=this.taskid.filter(t=>t.status=="COMPLETED");
  this.tasksUnstarted=this.taskid.filter(t=>t.status=="UNSTARTED");
  this.tasksCancel=this.taskid.filter(t=>t.status=="CANCEL");

  console.log("tasks Progress",this.tasksInprogress )
  console.log("tasks completed",this.tasksCompleted )
  console.log("tasks unstarted",this.tasksUnstarted )
  console.log("tasks cancel",this.tasksCancel )
}, (errorResponse: HttpErrorResponse) => {
  console.log(errorResponse);
}

) }

public getProjectById(id:number){
  this.projServ.getProjectById(id).subscribe((response:Projet)=>{
    console.log("project from params")
  console.log(response)
  console.log("project from params")

}, (errorResponse: HttpErrorResponse) => {
  console.log(errorResponse);
})
}























  //****************** */

  onFileChange(event) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.myFiles.push('assets/images/users/' + event.target.files[i].name);
    }
  }

  _fetchData() {
    // all tasks
    this.inprogressTasks = tasks.filter(t => t.taskType === 'inprogress');
    this.upcomingTasks = tasks.filter(t => t.taskType === 'upcoming');
    this.completedTasks = tasks.filter(t => t.taskType === 'completed');

    this.taskChart = taskChart;
  }


  get form() {
    return this.formData.controls;
  }

  listData() {
    if (this.formData.valid) {
      const name = this.formData.get('name').value;
      const status = this.formData.get('status').value;
      const taskType = this.formData.get('taskType').value;
      tasks.push({
        index: tasks.length + 1,
        name,
        status,
        taskType,
        images: this.myFiles,
        checked: true
      })
    }
    this.modalService.dismissAll()
    this._fetchData();
    this.submitted = false;
  }
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.modalService.open(content, { windowClass: 'modal-holder' });
  }
}

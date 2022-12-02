import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Projet } from 'src/app/core/models/projet';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { TaskService } from 'src/app/core/services/task.service';
import { Task } from 'src/app/core/models/task.models';

import { taskChart, tasks } from './data';

import { ChartType, Tasklist } from './list.model';
import { formatDate } from '@angular/common';
import { User } from 'src/app/core/models/auth.models';
import { Role } from 'src/app/core/enum/Role';
import { ConsoleLogger } from '@angular/compiler-cli/private/localize';

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
  id: number;



  tasksInprogress: Task[];
  tasksCompleted: Task[];
  tasksUnstarted: Task[];
  tasksCancel: Task[];


  selected: any;
  datetask: any;


  public testform: FormGroup;
  hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;
  @ViewChild('dp', { static: true }) datePicker: any;
  fromDate: Date;
  toDate: Date;
  dateRangeSelected: any;


  hidden: boolean;
  members: User[];
  projects: Projet[];
  userActuel: User;
  project: Projet;

  projectid: number;
  projectId: number;
  disablemember: boolean
  taskid: Task[];
  selectedProj: any;
  public selectTask = new Task();
  public editTask = new Task();
  public updateTask = new Task();
  date: any;


  constructor(private modalService: NgbModal, private router: Router, private taskServ: TaskService, private projServ: ProjectService, private formBuilder: FormBuilder, private authServ: AuthenticationService, private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.members = this.authServ.getUsersFromLocalCache().filter(u => u.role == "SU");

    this.hidden = true;
    this.disablemember = true
    this.userActuel = this.authServ.getUserFromLocalCache()
    this.getProjects()







    this._fetchData();




    //recupere project id
    console.log("pamaMap")
    this.activateRoute.paramMap.subscribe((params: ParamMap) => {
      if (params.get('id') != null) {
        this.projectid = parseInt(params.get('id'));

        this.getTasksbyIdProject(this.projectid);
        this.selectedProj = this.getProjectById(this.projectid)

      }

    })
  }
  // "project from params"
  public getProjectById(id: number) {
    this.projServ.getProjectById(id).subscribe((response: Projet) => {

      return response

    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
    })
  }







  getUpdateTask(i: number) {
    this.id = i;  //id of task selected
    this.router.navigate(['/p/tasks/updateTask/', this.id])
  }

  onSelectTask(task: Task) {
    this.selectTask = task
  }




  /**
  * Open scroll modal
  * @param updateModal scroll modal data
  */
  updateMD(task: Task, updateModal: any) {

    this.taskServ.taskByid(task.id).subscribe((task: Task) => {
      this.editTask = task

      //appeler fct date to converte from db to template
      this.traiterOutput();
      this.members = this.editTask.project.assigned_to

      if (task.creator.firstname) {
        this.modalService.open(updateModal, { scrollable: true, size: 'lg', centered: true });
      }

    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      console.log(errorResponse.error.message);
    })
  }




  detailTask(task: Task, scrollDataModal: any) {
    // this.selectTask=task

    this.taskServ.taskByid(task.id).subscribe((task: Task) => {
   
      this.selectTask = task
      if (task.creator.firstname) {
        this.modalService.open(scrollDataModal, { scrollable: true, size: 'lg', centered: true });
      }

    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      console.log(errorResponse.error.message);
    })
  }








  deleteMD(deleteDataModal: any) {
    this.modalService.open(deleteDataModal, { size: 'lg', centered: true });
  }

  onDeleteTask(idtask: number) {

    this.taskServ.deleteTask(idtask).subscribe(() => {
      this.getTasksbyIdProject(this.projectid);

      // console.log("delete succussfuly")

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

  public getTasksbyIdProject(idproj: number) {
    this.taskServ.listTaskByProject(idproj).subscribe((response: Task[]) => {
      this.taskid = response
      this.tasksInprogress = this.taskid.filter(t => t.status == "INPROGRESS");
      this.tasksCompleted = this.taskid.filter(t => t.status == "COMPLETED");
      this.tasksUnstarted = this.taskid.filter(t => t.status == "UNSTARTED");
      this.tasksCancel = this.taskid.filter(t => t.status == "CANCEL");

      
    }, (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
    }

    )
  }

  //list project 

  public getProjects(): void {

    if (this.isSimpleUser) {
      this.projServ.listProjectByAffectedTo(this.userActuel.id).subscribe((response: Projet[]) => {

        this.projects = response['results']
      }, (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
      }

      )
    } else {



      this.projServ.listProject().subscribe(
        (response: any[]) => {
          this.projects = response['results'];
        }, (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
        }
      )
    }
  }




  selectedProject(proj: any) {
    this.projectId = proj.id
    if (this.projectId != null) {
      this.disablemember = false
    }
    if (this.isManager) {

      this.members = proj.assigned_to
    }
  }





  //role 


  private getUserRole(): string {
    return this.authServ.getUserFromLocalCache().role;
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN;
  }

  public get isManager(): boolean {
    return this.isAdmin || this.getUserRole() === Role.MANAGER;
  }

  public get isSimpleUser(): boolean {
    return this.getUserRole() == Role.SIMPLEUSER;
  }


  public get isAny(): boolean {
    return this.isAdmin || this.isManager || this.isSimpleUser;
  }





  //*******  update function *********** */

  updateNewTask(updateTaskForm: any) {
    this.fixingCode(updateTaskForm)
    let idtask = this.editTask.id
    this.taskServ.updateTask(idtask, this.updateTask).subscribe((response: Task) => {
      this.getTasksbyIdProject(this.projectid);
      this.clickButton('update-close');



    },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.getTasksbyIdProject(this.projectid);
        this.clickButton('update-close');

      }
    )
  }

  //fixing code for object task updated 
  fixingCode(updatenewTaskForm: Task) {
    /**** form.value ******/
    this.updateTask.id = this.editTask.id;
    this.updateTask.createdate = this.editTask.createdate
    this.updateTask.creator = this.editTask.creator.id;
    this.updateTask.status = this.editTask.status;

    this.updateTask.name = updatenewTaskForm.name;
    this.updateTask.affectedTo = updatenewTaskForm.affectedTo.id;
    this.updateTask.description = updatenewTaskForm.description;
    this.updateTask.project = updatenewTaskForm.project.id;
    let dateupdate = new Date();
    /********date *******/
    let dt = formatDate(dateupdate, 'yyyy-MM-dd', 'en_US')
    this.updateTask.updatedate = dt;
    this.datetask = this.selected.split("-", 2)
    if ((this.datetask[0] != this.updateTask['startdate']) && (this.datetask[1] != this.updateTask['enddate'])) {
      if (this.datetask[0] != '') {

        this.traiterInPut()

      }
    }
  }


  // For date structure 

  traiterOutput() {
    let d1, d2, date1, date2;
    date1 = this.editTask['startdate'];
    date2 = this.editTask['enddate'];
    d1 = formatDate(date1, 'dd/MM/yyyy', 'en_US')
    d2 = formatDate(date2, 'dd/MM/yyyy', 'en_US')
    this.date = d1.concat("-", d2.toString())
    this.selected = this.date
  }


  traiterInPut() {
    let d1, d2;
    d1 = this.datetask[0];
    d2 = this.datetask[1];
    let date1 = d1.split("/", 3) //[19 ,10, 2022 ]
    let date2 = d2.split("/", 3)
    d1 = date1[2] + "-" + date1[1] + "-" + date1[0]
    d2 = date2[2] + "-" + date2[1] + "-" + date2[0]
    let start = formatDate(d1, 'yyyy-MM-dd', 'en_US')
    let end = formatDate(d2, 'yyyy-MM-dd', 'en_US')
    this.updateTask.startdate = start;
    this.updateTask.enddate = end;
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
      this.datetask = this.selected.split("-", 2)

      // this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });
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

  
  //  * @param date date obj
  //  */
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }
  //  * @param date date obj
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }
  //  * @param date date obj
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }

  //******************** */
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

}

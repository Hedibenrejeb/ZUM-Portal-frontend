import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Task } from 'src/app/core/models/task.models';
import { TaskService } from 'src/app/core/services/task.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { async, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { TransitiveCompileNgModuleMetadata } from '@angular/compiler';
import { TranslateCompiler } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import { User } from 'src/app/core/models/auth.models';
import { DatePipe } from '@angular/common';
import { ProjectService } from 'src/app/core/services/project.service';
import { Projet } from 'src/app/core/models/projet';

@Component({
  selector: 'app-updatetask',
  templateUrl: './updatetask.component.html',
  styleUrls: ['./updatetask.component.scss'],
  providers: [DatePipe]
})
export class UpdatetaskComponent implements OnInit {

  //  bread crumb items
  breadCrumbItems: Array<{}>;

  public Editor = ClassicEditor;

  form = new FormGroup({
    member: new FormArray([
      new FormControl(''),
    ]),
  });
  public testform: FormGroup;
  hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;
  hidden: boolean;
  selected: any;
  name: string;
  description = "Content of the editor"
  createdDate: Date;
  status: string;
  creator: string;
  project: string;
  affectedTo: string;
  startdate: Date;
  updatedate: Date;
  enddate: Date;
  Task: Task;
  task$: Observable<Task>;
  taskss$: Observable<Task[]>;
  tasks: any[];
  selectedId: any;
  projectmap: any;
  projectToUpdate;
  formUpdate: FormGroup;
  updatingError;
  datetask: any;
  newtask: any;
  date: any;
  userActuel: User;
  newTask: any;
  lastatask: any;
  projectsSu: Projet[] = [];
  projects: Projet[];
  asseinedTo: User[];
  usersProject: any;
  members: User[];
  d1t: string;


  public updateTask = new Task();
  @ViewChild('dp', { static: true }) datePicker: any;
  fromDate: Date;
  toDate: Date;
  dateRangeSelected: any;

  /**
   * Returns the form field value
   */
  get member(): FormArray { return this.form.get('member') as FormArray; }

  /**
   * Add the member field in form
   */
  addMember() {
    this.member.push(new FormControl());
  }

  /**
   * Onclick delete member from form
   */
  deleteMember(i: number) {
    this.member.removeAt(i);
  }

  constructor(private updateservice: TaskService,private projectServ:ProjectService, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService, private datePipe: DatePipe) {
    this.members = this.authenticationService.getUsersFromLocalCache().filter(u => u.role == "SU");
    console.log('members', this.members)
    this.userActuel = this.authenticationService.getUserFromLocalCache()
    console.log(this.userActuel)
    this.getProjects()
    //sol 6//
    var d = new Date()
    //console.log(this.datePipe.transform(d,"MM-dd-yyyy"))
    //console.log(this.datePipe.transform(d,"dd-MM-yyyy"))
    this.d1t = (this.datePipe.transform(d, "yyyy-MM-dd"))
    console.log(this.d1t)
    var d = new Date(this.d1t)
    console.log(d.getMonth() + 1)
    console.log(d.getDate())

  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Tasks' }, { label: 'Create Task', active: true }];
    //  this.taskss$ = this.route.paramMap.pipe(
    //   switchMap(params => {
    //     this.selectedId = Number(params.get('id'));
    //     console.log(params.get('id') )
    //     return this.updateservice.allTask();
    //   })
    // );
    this.hidden = true;
    this.selectedId = this.route.snapshot.paramMap.get('id');
    console.log(this.selectedId);
    this.getTasks();

    //  this.task$ = this.updateservice.updateTask(this.selectedId,this.Task);
    // console.log("element ||||||||||||||||||||||||||||||")

  }

  public getTasks() {
    this.updateservice.listTask().subscribe(
      (response) => {
        this.tasks = response;
        this.tasks.map(e => {
          let test: [] = e.project?.name
          // console.log("testing", test)
          // this.projectmap=test
          //  console.log(this.tasks)
        })
        this.updateTask = this.tasks.find(t => t.id == this.selectedId)
        console.log(this.updateTask)
        this.traiterOutput()
        // console.log(this.updateTask.name);
        // this.updateTask=this.lastatask
      }, (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
      }
    )

  }
  traiterOutput() {
    console.log(this.updateTask['startdate'])
    console.log(this.updateTask['enddate'])
    let d1, d2, date1, date2;
    date1 = this.updateTask['startdate'];
    date2 = this.updateTask['enddate'];
    d1 = formatDate(date1, 'dd/MM/yyyy', 'en_US')
    d2 = formatDate(date2, 'dd/MM/yyyy', 'en_US')
    this.date = d1.concat("-", d2.toString())
    console.log(this.date)
    this.selected = this.date
  }

  updateNewTask(updateTaskForm: Task) {

    this.fixingCode(this.updateTask)

    console.log(this.selectedId)
    this.updateservice.updateTask(this.selectedId, this.updateTask).subscribe((response: Task) => {
      console.log(response)
      // updateTaskForm =response;
      console.log("task updated")

    },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        // this.getTasks();

      }
    )
  }
  /* 
     getTask(){
     this.updateservice.getTaskbyId(this.selectedId).subscribe((response:Task)=>{
        console.log(response);
       // this.updateTask=response;   
      }, (erroR:HttpErrorResponse)=>{
  console.log("error",erroR)
      }
      
      ); 
     }
   */

  //  get f() {
  //   return this.updateTaskForm.controls;
  // }


  //  /**
  //   * on date selected
  //   * @param date date object
  //   */

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

  fixingCode(updatenewTaskForm: Task) {
    console.log("fixing")
    /**** form.value ******/
    this.updateTask.name = updatenewTaskForm.name;
    this.updateTask.creator = updatenewTaskForm.creator.id;
    this.updateTask.affectedTo = updatenewTaskForm.affectedTo.id;
    this.updateTask.description = updatenewTaskForm.description;
    this.updateTask.project = updatenewTaskForm.project.id;
    this.updateTask.status = updatenewTaskForm.status;
    let dateupdate= new Date();    
    /********date *******/
   let dt=formatDate(dateupdate,'yyyy-MM-dd','en_US')
   console.log("date update")
   console.log(dt)
   this.updateTask.updatedate=dt;
    console.log(this.selected)
    this.datetask = this.selected.split("-", 2)
    if ((this.datetask[0] != this.updateTask['startdate']) && (this.datetask[1] != this.updateTask['enddate'])) {
      if (this.datetask[0] != '') {

        this.traiterInPut()
        
      }
    }
    // console.log(this.updateTask)
  }



  traiterInPut() {
    console.log("testing date ")
    let d1, d2;
    d1 = this.datetask[0];
    d2 = this.datetask[1];
    console.log("d1,d2", d1, d2)
    let date1 = d1.split("/", 3) //[19 ,10, 2022 ]
    let date2 = d2.split("/", 3)
    console.log("date:", date1, date2)

    d1 = date1[2] + "-" + date1[1] + "-" + date1[0]
    d2 = date2[2] + "-" + date2[1] + "-" + date2[0]
    console.log("datestart", d1, "dateFin", d2)
    let start = formatDate(d1, 'yyyy-MM-dd', 'en_US')
    let end = formatDate(d2, 'yyyy-MM-dd', 'en_US')
    this.updateTask.startdate = start;
    this.updateTask.enddate= end;
  }


  // update() {
  //   this.updateservice.updateTask(this.selectedId, this.updateTask);
  // }
  /**
   * @param date date obj
   */
  public getProjects(): void {
    this.projectServ.listProject().subscribe(
      (response: any[]) => {
        //  console.log(response['results'])
        this.projects = response['results'];
        if (this.userActuel.role == "MG") {
          let i = [];
          this.projects.map((item) => {
            if (item.assigned_to.find(u => u.id == this.userActuel.id)) {
              i.push(this.projects.indexOf(item))
              //console.log(item)
            }
            for (let j = 0; j < i.length; j++) { this.projectsSu.push(this.projects[j]) }
            // console.log('i',i)
          })
          this.projects = this.projectsSu;
          // this.projServ.addprojectsToLocalCache(this.projects);
          //  console.log("liste assigned to ")
          console.log(this.projects)
        } else {
          // this.projServ.addprojectsToLocalCache(this.projects);
          console.log(this.projects);
        }
      }, (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
      }
    )
  }

}
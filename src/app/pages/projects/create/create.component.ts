import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfileService } from 'src/app/core/services/user.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { Project } from '../project.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  formCreate: FormGroup;
  submitted = false;
  error = '';
  successmsg = false;
  selectValue: Array<{}>;
  loggedUser;
  userid;
  dateProject: any;
  public addProject = new Project();
  dataproj:any;
  constructor(private calendar: NgbCalendar, private projectService: ProjectService,
    private formBuilder: FormBuilder,private router: Router, private UserProfileService: UserProfileService, private authServ: AuthenticationService) {
  }

  breadCrumbItems: Array<{}>;
  hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;
  selected: any;
  hidden: boolean;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();
  @ViewChild('dp', { static: true }) datePicker: any;


  ngOnInit() {

    this.loggedUser = this.authServ.getUserFromLocalCache().id
    console.log(this.loggedUser)
    this.getallusers();
    this.breadCrumbItems = [{ label: 'Projects' }, { label: 'Create New', active: true }];
    this.selected = '';
    this.hidden = true;
    this.submitted = false
    this.formCreate = this.formBuilder.group({
      project_name: ['', Validators.required,],
      assigned_to: ['', Validators.required,],
      project_description: ['', Validators.required],
      selected: ['', Validators.required],
    });

  }
  getallusers() {
    this.UserProfileService.getallusers().subscribe(
      data => {
        let listUser = data;
        this.selectValue = listUser.results;
        console.log("thisresults", this.selectValue)

      })
  }
  get f() {
    return this.formCreate.controls;
  }
  save() {
    this.submitted = true;
    let assigned_user = [];
    this.f.assigned_to.value.forEach(element => {
      assigned_user.push(element.id);
    });
    let projectData = {
      'name': this.f.project_name.value,
      'description': this.f.project_description.value,
      'created_by': this.loggedUser,
      'assigned_to': assigned_user,
    }
    this.dataproj=projectData
    this.fixingCode(this.dataproj)
    if (this.formCreate.invalid) {
      return;
    }
    if (!this.formCreate.invalid) {
      console.log("projectData", projectData)
      this.projectService.create(this.addProject).subscribe(
        data => {
          console.log("data", data)
          this.successmsg = true;
          if (this.successmsg) {
            this.router.navigate(['p/projects/list']);
          }
        },
        error => {
          this.error = error ? error : '';
        });
    }
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
      this.dateProject = this.selected.split("-",2)
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
  // /**
  //  * Is hovered over date
  //  * @param date date obj
  //  */
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }
  /**
  //  * @param date date obj
  //  */
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }
  // /**
  //  * @param date date obj
  //  */
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }
  fixingCode(newProject:Project){
    /**** form.value ******/
    this.addProject.name=newProject.name;
    this.addProject.description=newProject.description;
    this.addProject.assigned_to=newProject.assigned_to;
    this.addProject.created_by=newProject.created_by;
    /********date *******/
    let d1,d2;
    d1=this.dateProject[0];
    d2=this.dateProject[1];
    console.log(d1, d2 )
    let date1 =d1.split("/",3) //[19 ,10, 2022 ]
    let date2 =d2.split("/",3)
   
    d1 = date1[1] +"/" + date1[0]  +"/" + date1[2]
    d2 = date2[1] +"/" + date2[0]  +"/" + date2[2]
    let start=formatDate(d1,'yyyy-MM-dd','en_US')
    let end=formatDate(d2,'yyyy-MM-dd','en_US')
    this.addProject.starter_at=start;
    this.addProject.end_date=end;
  }
}


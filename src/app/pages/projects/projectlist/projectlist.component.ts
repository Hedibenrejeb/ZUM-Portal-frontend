import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { UserProfileService } from "src/app/core/services/user.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDate, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { formatDate } from "@angular/common";
import { Project } from "../project.model";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { ProjectService } from "src/app/core/services/project.service";
import { Projet } from "src/app/core/models/projet";




@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.scss']
})
export class ProjectlistComponent implements OnInit {
  submitted = false;
  breadCrumbItems: Array<{}>;
  projects: any[]=[];
  noData = true;
  updatingError;
  projectToUpdate;
  projectDetail;
  projectUpdated = false;
  selectValue: Array<{}>;
  statusValue: Array<{}>;
  projectToDelete;
  indexTodelete;
  deleted = false;
  deleteError = false;
  formUpdate: FormGroup;
  formDetail: FormGroup;
  page = 1;
  alignpage1 = 1;
  dateProject: any;
  dataproj: any;
  date;
  loggedUser;
  selectedProject:number;
  listProjectByUser;
  userId;


  constructor(private router:Router,private projectservice: ProjectService,
    private route: ActivatedRoute, private UserProfileService: UserProfileService,
    private modalService: NgbModal, private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private authServ: AuthenticationService) {
    this.statusValue = ['active', 'suspended', 'completed', 'paused'];
  }
  hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;
  selected: any;
  hidden: boolean;
  finaldate: any;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();
  @ViewChild('dp', { static: true }) datePicker: any;

  ngOnInit() {
    this.hidden=true;
    this.userId = this.authServ.getUserFromLocalCache().id;
    this.getListProjectByUser(this.userId)
    this.loggedUser = this.authServ.getUserFromLocalCache().role;
    this.breadCrumbItems = [{ label: 'Projects' }, { label: 'Projects List', active: true }];
    this.getAll();
    this.getallusers();
    this.formUpdate = new FormGroup({
      project_name: new FormControl('', [Validators.required]),
      assigned_to: new FormControl(['', Validators.required,]),
      starter_at: new FormControl(['', Validators.required,]),
      status: new FormControl(['', Validators.required,]),
      descreption: new FormControl(['', Validators.required,]),
    });

    this.formDetail = new FormGroup({
      assigned_to: new FormControl(['', Validators.required,]),
      descreption: new FormControl(['', Validators.required,]),
      matricule: new FormControl(['', Validators.required,]),
    });
  }

  public getListProjectByUser(userId: any) {
    this.projectService.getListProjectByUser(userId).subscribe(result => {
      this.listProjectByUser = result.results;
      console.log('this.listProjectByUser', this.listProjectByUser);
    });
  }
  getAll() {
    this.projectservice.getAll().subscribe(result => {
      this.projects = result.results;
      console.log('results******', this.projects);
      if (this.projects.length > 0) {
        this.noData = false;
      }
    });
  }

  get f() {
    return this.formUpdate.controls;
  }

  dismiss(modal){
    modal.dismiss();
    this.hidden=true;
  }
  


  getallusers() {
    this.UserProfileService.getallusers().subscribe(
      data => {
        let listUser = data;
        this.selectValue = listUser.results;
      })
  }
  /* tesiting  */

  openModal(template: TemplateRef<any>) {
    this.modalService.open(template, { size: 'lg' });
  }

  openModal2(template: TemplateRef<any>) {
    this.modalService.open(template, { size: 'lg' });
  }

  openModadelete(template: TemplateRef<any>) {
    this.modalService.open(template, { centered: true });
  }

  openUpdateModal(template: TemplateRef<any>, project) {/* 2022/mm/dd */
    this.openModal2(template);
    this.projectToUpdate = project;
    let d1, d2, date1, date2;
    date1 = this.projectToUpdate.starter_at;
    date2 = this.projectToUpdate.end_date;
    d1 = formatDate(date1, 'dd/MM/yyyy', 'en_US')
    d2 = formatDate(date2, 'dd/MM/yyyy', 'en_US')
    this.date = d1.concat("-", d2.toString())
    this.selected = this.date
    this.formUpdate = this.formBuilder.group({
      project_name: [project.name, Validators.required,],
      assigned_to: [project.assigned_to, Validators.required,],
      selected: [this.date, Validators.required],
      status: [project.status, Validators.required],
    })
  }

  


  openDetailModal(template: TemplateRef<any>, project) {
    this.openModal(template);
    this.projectDetail = project;
    this.formDetail = this.formBuilder.group({
      assigned_to: [project.assigned_to, Validators.required,],
      descreption: [project.description, Validators.required],
      matricule: [project.matricule, Validators.required],
    })

  }

  update() {
    if (this.formUpdate.valid) {
      let assigned_user = [];
      this.f.assigned_to.value.forEach(element => {
        assigned_user.push(element.id);
      });
      this.dateProject = this.selected.split("-", 2)
      if((this.dateProject[0] != this.date['startdate']) && (this.dateProject[1] != this.date['enddate'])) {
        if (this.dateProject[0] != '') {
          this.traiterInput();
        }}
      let projecttoUpdate = {
        'id': this.projectToUpdate.id,
        'name': this.f.project_name.value,
        'description': this.projectToUpdate.description,
        'assigned_to': assigned_user,
        'created_by': this.projectToUpdate.created_by.id,
        'status': this.f.status.value,
        'starter_at': this.projectToUpdate.starter_at,
        'end_date': this.projectToUpdate.end_date
      }
       
      console.log("projecttoUpdate", projecttoUpdate)
        this.projectservice.updateproject(projecttoUpdate).subscribe(result => {
        this.projectUpdated = true;
        this.getAll();
      }, error => {
        this.projectUpdated = false;
        this.updatingError = true;
      });
      this.modalService.dismissAll();
    }
  }
  
  traiterInput(){
    let d1, d2;
    d1 = this.dateProject[0];
    d2 = this.dateProject[1];
    let date1 = d1.split("/", 3) 
    let date2 = d2.split("/", 3)
    d1 = date1[2] + "-" + date1[1] + "-" + date1[0]
    d2 = date2[2] + "-" + date2[1] + "-" + date2[0]
    this.projectToUpdate.starter_at = d1;
    this.projectToUpdate.end_date = d2;
    }

  openDeleteModal(confirmDelete: TemplateRef<any>, projects) {
    this.projectToDelete = projects;
    this.openModadelete(confirmDelete);
  }

  confirm() {
    this.projectservice.deleteProjects(this.projectToDelete.id).subscribe(result => {
      this.deleted = true;
      this.getAll();
    });
    this.modalService.dismissAll();
  }

  /* on date selected
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
      this.dateProject = this.selected.split("-", 2)
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

  public tasksbyProject(project:Projet){
    this.selectedProject=project.id;
    this.router.navigate(['/p/tasks/list', project.id]);
  } 
  
}

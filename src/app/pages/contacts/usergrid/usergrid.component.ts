import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, Form } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/auth.models';
import { Subscription } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Usergrid } from './usergrid.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ProjectService } from 'src/app/core/services/project.service';
@Component({
  selector: 'app-usergrid',
  templateUrl: './usergrid.component.html',
  styleUrls: ['./usergrid.component.scss']
})
/**
* Contacts user grid component
*/
export class UsergridComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  pass = '';
  newUserForm: FormGroup;
  user: User;
  submitted = false;
  error = '';
  listUser;
  listProject;
  loggedUser;
  userlist;
  projectDetailByuser;
  projectDetail;
  formproject: FormGroup;
  userGridData: Usergrid[];
  breadCrumbItems: Array<{}>;
  project;
  projects: Array<{}>;
  userid;
  noData = true;
  role = ['manager', 'admin', 'simpleUser'];
  userForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['MG', [Validators.required]],
  });
  constructor(private UserProfileService: UserProfileService, private modalService: NgbModal,
    private formBuilder: FormBuilder, private projectService: ProjectService, private authServ: AuthenticationService) {
    this.formproject = new FormGroup({
      name: new FormControl('', [Validators.required]),
      starter_at: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit() {
    this.loggedUser = this.authServ.getUserFromLocalCache().role;
    this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Users Grid', active: true }];
    this.newUserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['MG', [Validators.required]],
    });
    this.getallusers();
    this.getAllProject();
  }
  getAllProject() {
    this.projectService.getAll().subscribe(result => {
      this.projects = result.results;
      if (this.projects.length > 0) {
        this.noData = false;
      }
    });
  }
  onSubmit() {
    this.submitted = true
  }
  get f() { return this.newUserForm.controls; }
  openModal(content: any) {
    this.modalService.open(content);
  }
  private _fetchData() {
    this.userGridData = this.listUser;
  }
  public onAddNewUser(newUserForm: User): void {
    this.user = newUserForm;
    this.submitted = true;
    this.subscriptions.push(
      this.UserProfileService.register(this.user).subscribe(
        (response: HttpResponse<User>) => {
          this.clickButton('add-user-close');
          this.submitted = false;
          this.newUserForm = this.userForm;
          this.getallusers();
        }, (errorResponse: HttpErrorResponse) => {
          this.error = 'Invalid credentials, try again '
          console.log(errorResponse);
          this.submitted = false;
          this.clickButton('add-user-close');
          this.newUserForm = this.userForm;
        }
      )
    );
  }
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }
  public saveNewTask(): void {
    this.clickButton('new-user-save');
    this.clickButton('add-user-close');
  }
  openModalProject(template: TemplateRef<any>) {
    this.modalService.open(template, { size: 'lg' });
  }
  openProjectModal(template: TemplateRef<any>, userId) {
    this.openModalProject(template);
    this.getListProjectByUser(userId);
  }
  public getListProjectByUser(userId: any) {
    this.projectService.getListProjectByUser(userId).subscribe(result => {
      this.listProject = result.results;
      console.log('this.listProject', this.listProject);
    });
  }
  /**
  * Open modal
  * @param content modal content
  */
  getallusers() {
    this.UserProfileService.getallusers().subscribe(
      data => {
        let listUser = data;
        this.userGridData =data['results'];
        this.userid = this.userGridData;
      })
  }
}
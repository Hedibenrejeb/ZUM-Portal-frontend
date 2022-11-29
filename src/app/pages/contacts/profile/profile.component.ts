import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import { Usergrid } from '../usergrid/usergrid.model';

import { revenueBarChart, statData } from './data';

import { ChartType } from './profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

/**
 * Contacts-profile component
 */
export class ProfileComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  revenueBarChart: ChartType;
  statData;
  listProjectByUser;
  projects: any[]=[];
  userId;
  userGridData: Usergrid[];
  user;
  formUpdate: FormGroup;
  userToUpdate;
  submitted = false;
  hidden: boolean;
  userid;
  fileToUpload: File = null;
  somme: number;






  constructor(private projectService: ProjectService,private authServ: AuthenticationService,
    private UserProfileService: UserProfileService,private modalService: NgbModal,
    private formBuilder: FormBuilder,) { 
      this.formUpdate = new FormGroup({
        firstname: new FormControl('', [Validators.required]),
        lastname: new FormControl(['', Validators.required,]),
        Mobile: new FormControl(['', Validators.required,]),
        email: new FormControl(['', Validators.required,]),
        Location: new FormControl(['', Validators.required,]),
        Experience: new FormControl(['', Validators.required,]),
      });
    }

  ngOnInit() {
    this.userId = this.authServ.getUserFromLocalCache().id;
    this.userid = this.authServ.getUserFromLocalCache().id;
    this.getListProjectByUser(this.userId)
    this.getallusers()
    this.getUserById(this.userId)
    this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Profile', active: true }];
    
    // fetches the data
    this._fetchData();
  }
  openModal2(template: TemplateRef<any>) {
    this.modalService.open(template, { size: 'lg' });
  }

  openUpdateModal(template: TemplateRef<any>,user) {/* 2022/mm/dd */
    this.openModal2(template);
    console.log('user', user)
    this.formUpdate = this.formBuilder.group({
      firstname: [user.firstname, Validators.required,],
      lastname: [user.lastname, Validators.required,],
      Mobile: [user.Mobile, Validators.required],
      email: [user.email, Validators.required],
      Location: [user.Location, Validators.required],
      Experience: [user.Experience, Validators.required],
    })
    console.log('user.firstname', user.firstname)
    console.log('formUpdate', this.formUpdate)
  }
  /**
   * Fetches the data
   */
  private _fetchData() {
    this.revenueBarChart = revenueBarChart;
    this.statData = statData;
  }

  public getListProjectByUser(userId: any) {
    this.projectService.getListProjectByUser(userId).subscribe(result => {
      this.projects = result.results;
      console.log('this.projects', this.projects);
    });
  }

  public getUserById(userId: any) {
    this.UserProfileService.getUserById(userId).subscribe(result => {
      this.user = result.results;
      console.log('this.user*********', this.user);
    });
  }

  getallusers() {
    this.UserProfileService.getallusers().subscribe(
      data => {
        let listUser = data;
        this.userGridData =data['results'];
        console.log('data*******', this.userGridData);
        this.userId = this.userGridData;
      })
  }

  updateProfile(){
    if (this.formUpdate.valid) {
      let usertoUpdate = {
        'id': this.userid,
        'firstname': this.f.firstname.value,
        'lastname': this.f.lastname.value,
        'Mobile': this.f.Mobile.value,
        'Location': this.f.Location.value,
        'Experience': this.f.Experience.value,
        'email': this.f.email.value,
      }
      console.log('usertoUpdate', usertoUpdate)
    this.UserProfileService.update(usertoUpdate).subscribe(
      data => {
        this.user= data
        console.log('this.userbackend', this.user);
        this.getUserById(this.userid);
      })
      this.modalService.dismissAll();
    }
  }

  dismiss(modal){
    modal.dismiss();
    this.hidden=true;
  }

  get f() {
    return this.formUpdate.controls;
  }
  handleImageCandidatInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
}

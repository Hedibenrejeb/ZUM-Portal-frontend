import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadStatus } from 'src/app/core/models/FileUploadStatus';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
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
  fileToUpload: File;
  somme: number;
  pathfile;
  savedFile;
  photo;
  url ;
  userImage;
  public fileStatus= new FileUploadStatus();
  usertest :any;
  userList;
  public host = environment.apiUrl;
  userphoto;


  constructor(private projectService: ProjectService,private authServ: AuthenticationService,
    private UserProfileService: UserProfileService,private modalService: NgbModal,
    private formBuilder: FormBuilder,) 
    { 
      this.formUpdate = new FormGroup({
        firstname: new FormControl('', [Validators.required]),
        lastname: new FormControl(['', Validators.required,]),
        Mobile: new FormControl(['', Validators.required,]),
        email: new FormControl(['', Validators.required,]),
        Location: new FormControl(['', Validators.required,]),
        Experience: new FormControl(['', Validators.required,]),
      });
    }

  ngOnInit(){
    this.userId = this.authServ.getUserFromLocalCache().id;
    this.userid = this.authServ.getUserFromLocalCache().id;
    this.getListProjectByUser(this.userId);
    this.getallusers();
    this.getUserById(this.userId);
    // this.userImage=`${this.host}`+this.authServ.getUserFromLocalCache().photo;
    this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Profile', active: true }];
    this._fetchData();
  }


  openModal2(template: TemplateRef<any>) {
    this.modalService.open(template, { size: 'lg' });
  }

  openUpdateModal(template: TemplateRef<any>,data) {/* 2022/mm/dd */
    this.openModal2(template);
    this.formUpdate = this.formBuilder.group({
      firstname: [data.firstname, Validators.required,],
      lastname: [data.lastname, Validators.required,],
      Mobile: [data.Mobile, Validators.required],
      email: [data.email, Validators.required],
      Location: [data.Location, Validators.required],
      Experience: [data.Experience, Validators.required],
    })
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
      this.user = result;
      console.log("cccccccc123ccc",result)
      console.log("ccccccccccc",this.user)
    }
    );
  }

  getallusers() {
    this.UserProfileService.getallusers().subscribe(
      data => {
        let listUser = data;
        this.userGridData =data['results'];
        console.log('data*******', this.userGridData);
        this.userList = this.userGridData;
      })
  }

  updateProfile(){
    if (this.formUpdate.valid) {
      let usertoUpdate = {
        'id': this.userId,
        'firstname': this.f.firstname.value,
        'lastname': this.f.lastname.value,
        'Mobile': this.f.Mobile.value,
        'Location': this.f.Location.value,
        'Experience': this.f.Experience.value,
        'email': this.f.email.value,
      }
      console.log('usertoUpdate', usertoUpdate)
    this.UserProfileService.UpdateProfile(usertoUpdate).subscribe(
      data => {
        this.user= data
        this.userphoto=data.photo
        console.log('this.userbackendaftersave', data);
        this.getUserById(this.userId); 
      }
      ) 
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
 



  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
      this.UserProfileService.updateProfileAvatar(event.target.files[0],this.userId).subscribe(data=> {
      },err => console.log("ERRRRRr",err))
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { first } from 'rxjs/operators';
import { UserProfileService } from '../../../core/services/user.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/models/auth.models';
import { HttpErrorResponse } from '@angular/common/http';
import { MustMatch } from './validation.mustmatch';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  submitted = false;
  error = '';
  successmsg = false;
  userid;

  // set the currenr year
  year: number = new Date().getFullYear();

  private subscriptions: Subscription[]=[];

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private userService: UserProfileService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {

      console.log("params", params['id'])

      this.userid = params['id']



    })

    this.signupForm = this.formBuilder.group({
      firstname: ['', Validators.required,],
      lastname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmpassword'),
    });
    this.submitted = false
  }

    // this.signupForm = this.formBuilder.group({
    //   firstname: ['', Validators.required],
    //   lastname: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   password: ['', Validators.required],
    // });}
  

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  /**
   * On submit form
   */




   onSubmit() {
    this.submitted = true;
    let profileData = {
      'id': this.userid,
      'firstname': this.f.firstname.value,
      'lastname': this.f.lastname.value,
      'password': this.f.password.value,
    }
    if (this.signupForm.invalid) {
      return;
    }
    if (this.signupForm.valid) {
      console.log("profileData", profileData)
      this.userService.update(profileData).subscribe(
        data => {
          console.log("data", data)

          this.successmsg = true;
          if (this.successmsg) {
            this.router.navigate(['/account/login']);
          }
        },
        error => {
          this.error = error ? error : '';
        }
      );
    }

  }

}










  //  onSubmit(user):void {
  //   this.submitted = true;
  //   console.log(user)
  //   // stop here if form is invalid
  //   if (this.signupForm.invalid) {
  //     return;
  //   } else {
  //     this.subscriptions.push(
  //       this.authenticationService.addUser(user).subscribe(
  //         (response:User)=>{
  //           console.log(response);
  //           console.log(`${response['firstname']}user added` )
         
  //     this.router.navigateByUrl('/p')

  //     this.submitted=false;
  //   },(errorResponse:HttpErrorResponse)=>{
  //     this.error='Invalid credentials, try again '
  //   console.log(errorResponse);
  //   //this.sendErrorNotification(NotificationType.ERROR,errorResponse.error.message);
  //   this.submitted=false;
  //   }
  //   ));}}










  /* onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    } else {
      if (environment.defaultauth === 'firebase') {
        this.authenticationService.register(this.f.email.value, this.f.password.value).then((res: any) => {
          this.successmsg = true;
          if (this.successmsg) {
            this.router.navigate(['/dashboard']);
          }
        })
          .catch(error => {
            this.error = error ? error : '';
          });
      } else {
        this.userService.register(this.signupForm.value)
          .pipe(first())
          .subscribe(
            data => {
              this.successmsg = true;
              if (this.successmsg) {
                this.router.navigate(['/account/login']);
              }
            },
            error => {
              this.error = error ? error : '';
            });
      }
    }
  }} */


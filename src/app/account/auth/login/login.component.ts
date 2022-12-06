import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/models/auth.models';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {
  private subscriptions: Subscription[]=[];
  pass='';
  typeSee="password"
  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;
  see= false ;
  // set the currenr year
  year: number = new Date().getFullYear();
  users:User[];
  projects:any[];
  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['user@zum-it.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
      /*  email: ['admin@themesbrand.com', [Validators.required, Validators.email]],
       password: ['123456', [Validators.required]], */
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if(this.authenticationService.isLoggedIn()){
      this.router.navigateByUrl('/p/dashboards/default');
    
    }else {
      this.router.navigateByUrl('/login');
    }

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
   onCanSee(){
    this.see=!this.see
    if (this.see==true) {
      this.typeSee='text'
    }else this.typeSee='password'
   return this.pass
   }



  onLogin(user:User):void {
    this.submitted = true;
    this.pass=user['password']
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      this.subscriptions.push(
        this.authenticationService.login1(user).subscribe(
          (response:HttpResponse<User>)=>{
           // console.log(response.body['tokens'])
       // const token =response.headers.get(HeaderType.JWT_TOKEN);
         //  const token=response.body['tokens']['token']['access']
           const token =response.body['token']
          this.authenticationService.saveToken(token);
          //get user by refrech token 
          this.authenticationService.addUserToLocalCache(response.body); 
          this.getUsers()
      this.router.navigateByUrl('/p')
       //   this.getTasks()
      this.submitted=false;
    },(errorResponse:HttpErrorResponse)=>{
      this.error='Invalid credentials, try again '
    console.log(errorResponse);
    //this.sendErrorNotification(NotificationType.ERROR,errorResponse.error.message);
    this.submitted=false;
    }
    ));}}




  public getUsers(): void {
      this.authenticationService.listUser().subscribe(
        (response: User[]) => {
          this.users = response['results'];
          this.authenticationService.addUsersToLocalCache(this.users);
        }, (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
        }
      )
      
    } 
   
   




     /*  if (environment.defaultauth === 'firebase') {
        this.authenticationService.login(this.f.email.value, this.f.password.value).then((res: any) => {
          this.router.navigate(['/account/login']);
        })
          .catch(error => {
            this.error = error ? error : '';
          });
      } */

      /*  else {
        this.authFackservice.login(this.f.email.value, this.f.password.value)
          .pipe(first())
          .subscribe(
            data => {
              this.router.navigate(['/dashboard']);
            },
            error => {
              this.error = error ? error : '';
            });
      } */


  //  private  sendErrorNotification(notificationType: NotificationType, message: string):void {
  //       if(message){
  //       //  this.notificationService.notify(notificationType,message);
  //      console.log(notificationType,message);
        
  //       } else {
  //         console.log(notificationType,'An error occured . Please try again.')
  //        // this.notificationService.notify(notificationType,'An error occured . Please try again.')
  //       } 
  //     }

    ngOnDestroy():void{
      this.subscriptions.forEach(sub=>sub.unsubscribe());
    }

}



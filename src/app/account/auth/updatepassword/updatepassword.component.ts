import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Configpass } from 'src/app/core/models/configpass';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { MustMatch } from 'src/app/pages/form/validation/validation.mustmatch';

@Component({
  selector: 'app-updatepassword',
  templateUrl: './updatepassword.component.html',
  styleUrls: ['./updatepassword.component.scss']
})
export class UpdatepasswordComponent implements OnInit {

  resetForm: FormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;
  data:Configpass=new Configpass();
  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      newpassword: ['', [Validators.required,Validators.minLength(8)]],
      confirmnewpassword: ['', Validators.required ] },
      {
        validator: MustMatch('newpassword', 'confirmnewpassword'),
      });
     this.submitted = false;
  }
  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }
 
  onSubmit(){
    this.success = '';
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }
    if (this.resetForm.valid) {
      this.route.paramMap.subscribe(params => {
        let token = params.get('token')
        let u=params.get('u')
        this.data.password=this.f.newpassword.value;
        this.data.token=token;
        this.data.uidb64=u;
        this.authenticationService.resetpassafteremail(this.data).subscribe(response=> {
          console.log("success", response)
        },
        (error:HttpErrorResponse) => {
         console.log("error",error)
        }) 
      });
  }}
}

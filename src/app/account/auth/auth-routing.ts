import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { Login2Component } from './login2/login2.component';

import { SignupComponent } from './signup/signup.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { Register2Component } from './register2/register2.component';
import { Recoverpwd2Component } from './recoverpwd2/recoverpwd2.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UpdatepasswordComponent } from './updatepassword/updatepassword.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent 

    },
    {
        path: 'signup/:id',
        component: SignupComponent
    },
   
    {
        path: 'reset-password',
        component: PasswordresetComponent
    },
    {
        path: 'recoverpwd-2',
        component: Recoverpwd2Component, canActivate: [AuthGuard]
    },
    {
        path: 'login-2',
        component: Login2Component, canActivate: [AuthGuard]
    },
    {
        path: 'updatepassword',
        component: UpdatepasswordComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }

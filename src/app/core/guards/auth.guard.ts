import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
//import { NotificationService } from '../services/notification.service';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    private token: string;

    constructor(
        private router: Router,
        private authServ: AuthenticationService,
     //  private notificationServ:NotificationService,
        private authFackservice: AuthfakeauthenticationService
    ) { }


    canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot):boolean  {
        this.token=localStorage.getItem('token');
        //console.log(this.authServ.loadToken())
        console.log(this.token)
        if(this.authServ.isLoggedIn()){
    
          return true ;
        }
      this.router.navigate(['/login']);
      //send notif to user 
      console.log(`You need to log in to access this page`)
   //this.notificationServ.notify(NotificationType.ERROR,`You need to log in to access this page`);
      return false;
      
      } 

   /*  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if (environment.defaultauth === 'firebase') {
            const currentUser = this.authenticationService.currentUser();
            if (currentUser) {
                // logged in so return true
                return true;
            }
        } else {
            const currentUser = this.authFackservice.currentUserValue;
            if (currentUser) {
                // logged in so return true
                return true;
            }
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
        return false;
    } */
}
